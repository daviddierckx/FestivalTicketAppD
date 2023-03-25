const errors = require("../middleware/errors")
const neo = require('../../neo')

// the schema is supplied by injection
class UserCrudController {
    constructor(model) {
        console.log(model);
        this.model = model
    }

    addFriend = async (req, res, next) => {
        try {
            const sender = await this.model.findById(req.user._id)
            const receiverEmail = req.params.email

            // open a neo session
            const session = neo.session()

            // create a new friend request relationship between existing nodes
            const result = await session.run(`
                MATCH (sender:User { email: $senderEmail })
                MATCH (receiver:User { email: $receiverEmail })
                CREATE (sender)-[:REQUESTED_FRIEND { status: 'pending' }]->(receiver)
                RETURN sender, receiver
            `, {
                senderEmail: sender.email.toString(),
                receiverEmail: receiverEmail.toString(),
            })

            // close the neo session
            session.close()

            const sentFriendRequest = result.records[0]

            // check if the receiver user exists in the database
            if (!sentFriendRequest) {
                return res.status(404).json({
                    error: true,
                    message: `User with email ${receiverEmail} not found`,
                })
            }

            // send response indicating that friend request has been sent
            res.status(201).json({
                error: false,
                message: `Friend request sent to ${receiverEmail}`,
                sender: sentFriendRequest.get('sender').properties,
                receiver: sentFriendRequest.get('receiver').properties,
            })

        } catch (err) {
            console.log(err)
            res.status(500).json({ error: true, message: "Internal Server Error" })
        }
    }

    acceptFriend = async (req, res, next) => {
        try {
            const receiver = await this.model.findById(req.user._id)
            const senderEmail = req.params.email

            // open a neo session
            const session = neo.session()

            // update the friend request status to "accepted"
            const result = await session.run(`
                MATCH (sender:User { email: $senderEmail })
                MATCH (receiver:User { email: $receiverEmail })
                MATCH (sender)-[r:REQUESTED_FRIEND]->(receiver)
                SET r.status = 'accepted'
                CREATE (sender)-[:FRIENDS { since: date() }]->(receiver)
                CREATE (receiver)-[:FRIENDS { since: date() }]->(sender)
                RETURN count(r) as rowsChanged
            `, {
                senderEmail: senderEmail.toString(),
                receiverEmail: receiver.email.toString(),
            })

            // close the neo session
            session.close()

            const rowsChanged = result.records[0].get('rowsChanged').toNumber()

            if (rowsChanged === 0) {
                return res.status(400).json({
                    error: true,
                    message: `Could not accept friend request from ${senderEmail}`,
                })
            }

            // send response indicating that friend request has been accepted
            res.status(200).json({
                error: false,
                message: `Friend request from ${senderEmail} has been accepted`,
            })

        } catch (err) {
            console.log(err)
            res.status(500).json({ error: true, message: "Internal Server Error" })
        }
    }

    follow = async (req, res, next) => {
        try {
            const follower = await this.model.findById(req.user._id)
            const followeeEmail = req.params.email

            // open a neo session
            const session = neo.session()

            // check if the relationship already exists
            const result = await session.run(`
            MATCH (follower:User { email: $followerEmail })
            MATCH (followee:User { email: $followeeEmail })
            MATCH (follower)-[r:FOLLOWS]->(followee)
            RETURN COUNT(r) AS relationshipCount
          `, {
                followerEmail: follower.email.toString(),
                followeeEmail: followeeEmail.toString(),
            })

            const relationshipCount = result.records[0].get('relationshipCount').toNumber()

            if (relationshipCount > 0) {
                // close the neo session
                session.close()

                res.status(400).json({
                    error: true,
                    message: `You are already following ${followeeEmail}`
                })

                return
            }

            // create a new follows relationship between existing nodes
            await session.run(`
            MATCH (follower:User { email: $followerEmail })
            MATCH (followee:User { email: $followeeEmail })
            CREATE (follower)-[:FOLLOWS]->(followee)
          `, {
                followerEmail: follower.email.toString(),
                followeeEmail: followeeEmail.toString(),
            })

            // close the neo session
            session.close()

            // send response indicating that follow relationship has been created
            res.status(201).json({
                error: false,
                message: `You are now following ${followeeEmail}`,
            })

        } catch (err) {
            console.log(err)
            res.status(500).json({ error: true, message: "Internal Server Error" })
        }
    }



    unfollow = async (req, res, next) => {
        try {
            const follower = await this.model.findById(req.user._id);
            const followeeEmail = req.params.email;

            // open a neo session
            const session = neo.session();

            // delete the FOLLOWS relationship between the users
            const result = await session.run(`
            MATCH (follower:User { email: $followerEmail })-[r:FOLLOWS]->(followee:User { email: $followeeEmail })
            DELETE r
            RETURN count(r)
          `, {
                followerEmail: follower.email.toString(),
                followeeEmail: followeeEmail.toString(),
            });

            // close the neo session
            session.close();

            const rowsChanged = result.records[0].get('count(r)').toNumber();

            if (rowsChanged === 0) {
                res.status(404).json({
                    error: true,
                    message: `Could not unfollow ${followeeEmail}. Relationship does not exist.`,
                });
            } else {
                res.status(200).json({
                    error: false,
                    message: `Successfully unfollowed ${followeeEmail}.`,
                });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: true, message: "Internal Server Error" });
        }
    }

    //TODO comments toevoegen

    getFriends = async (req, res, next) => {
        try {
            const currentUser = await this.model.findById(req.user._id)

            // open a neo session
            const session = neo.session()

            // get all friends of the current user
            const result = await session.run(`
            MATCH (user:User { email: $userEmail })
            MATCH (user)-[:FRIENDS]->(friend:User)
            RETURN friend
          `, {
                userEmail: currentUser.email.toString(),
            })

            // close the neo session
            session.close()

            const friends = result.records.map(record => record.get('friend').properties)

            // send response with list of friends
            res.status(200).json({
                error: false,
                friends: friends,
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: true, message: "Internal Server Error" })
        }
    }

    //Get een lijst van mensen die mij volgen
    getFollowers = async (req, res, next) => {
        try {
            const currentUser = await this.model.findById(req.user._id)

            // open a neo session
            const session = neo.session()

            // get all followers of the current user
            const result = await session.run(`
            MATCH (user:User { email: $userEmail })
            MATCH (follower:User)-[:FOLLOWS]->(user)
            RETURN follower
          `, {
                userEmail: currentUser.email.toString(),
            })

            // close the neo session
            session.close()

            const followers = result.records.map(record => record.get('follower').properties)

            // send response with list of followers
            res.status(200).json({
                error: false,
                followers: followers,
            })
        } catch (err) {
            console.log(err)
            res.status(500).json({ error: true, message: "Internal Server Error" })
        }
    }

    //Get een lijst van mensen die ik heb gevolgd
    getFollowed = async (req, res, next) => {
        try {
            const session = neo.session();

            // find the current user
            const currentUser = await this.model.findById(req.user._id);

            // find all users that the current user follows
            const result = await session.run(`
            MATCH (u:User { email: $email })-[:FOLLOWS]->(f:User)
            RETURN f
          `, {
                email: currentUser.email.toString(),
            });

            // close the neo session
            session.close();

            // extract the user nodes from the result
            const following = result.records.map(record => record.get('f').properties);

            res.status(200).json({
                error: false,
                message: 'Following retrieved successfully',
                following,
            });

        } catch (err) {
            console.log(err);
            res.status(500).json({ error: true, message: 'Internal Server Error' });
        }
    }

}

module.exports = UserCrudController;
