const neo4j = require('neo4j-driver')

function connect(dbName) {
    this.dbName = dbName
    this.driver = neo4j.driver(
        process.env.NEO4J_URL,
        neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD)
    )
}

function connectTest(dbName) {
    this.dbName = dbName
    this.driver = neo4j.driver(
        process.env.NEO4J_TEST_URL,
        neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_TEST_PASSWORD)
    )
}

function session() {
    return this.driver.session({
        database: this.dbName,
        defaultAccessMode: neo4j.session.WRITE
    })
}

const addFriend = `
MATCH (sender:User { email: $senderEmail })
MATCH (receiver:User { email: $receiverEmail })
CREATE (sender)-[:REQUESTED_FRIEND { status: 'pending' }]->(receiver)
RETURN sender, receiver
`;

const acceptFriend = `
MATCH (sender:User { email: $senderEmail })
MATCH (receiver:User { email: $receiverEmail })
MATCH (sender)-[r:REQUESTED_FRIEND]->(receiver)
SET r.status = 'accepted'
CREATE (sender)-[:FRIENDS { since: date() }]->(receiver)
CREATE (receiver)-[:FRIENDS { since: date() }]->(sender)
RETURN count(r) as rowsChanged
`

const followFriend = `
MATCH (follower:User { email: $followerEmail })
MATCH (followee:User { email: $followeeEmail })
MATCH (follower)-[r:FOLLOWS]->(followee)
RETURN COUNT(r) AS relationshipCount
`;

const followee = `
MATCH (follower:User { email: $followerEmail })
MATCH (followee:User { email: $followeeEmail })
CREATE (follower)-[:FOLLOWS]->(followee)
`

const unfollow = `
MATCH (follower:User { email: $followerEmail })-[r:FOLLOWS]->(followee:User { email: $followeeEmail })
DELETE r
RETURN count(r)
`
const deleteFriend = `
MATCH (u1:User { email: $email1 })-[r1:FRIEND]->(u2:User { email: $email2 })
MATCH (u2)-[r2:FRIEND]->(u1)
OPTIONAL MATCH (u1)-[f:FOLLOWS]->(u2)
DELETE r1, r2, f`;


const getFriends = `
MATCH (user:User { email: $userEmail })
MATCH (user)-[:FRIENDS]->(friend:User)
RETURN friend
`
const getFollowers = `
MATCH (user:User { email: $userEmail })
MATCH (follower:User)-[:FOLLOWS]->(user)
RETURN follower
`

const getFollowed = `
MATCH (u:User { email: $email })-[:FOLLOWS]->(f:User)
RETURN f
`

const addComment = `
MATCH (f:Festival)
WHERE f.id = $festivalId
CREATE (c:Comment { id: $commentId, text: $commentText, createdAt: timestamp() })
CREATE (c)-[:COMMENTED_ON]->(f)
CREATE (c)-[:POSTED_BY]->(u:User { email: $email })
RETURN c
`
const addReply = `
MATCH (c:Comment)
WHERE c.id = $commentId
CREATE (r:Reply { text: $replyText, createdAt: timestamp() })
CREATE (r)-[:REPLIED_TO]->(c)
CREATE (r)-[:POSTED_BY]->(u:User { email: $email })
RETURN r
`
const getAllCommentsWithReplies = `
MATCH (f:Festival)
WHERE f.id = $festivalId
OPTIONAL MATCH (c:Comment)-[:COMMENTED_ON]->(f)
OPTIONAL MATCH (c)-[:REPLIED_TO]->(parent)
OPTIONAL MATCH (reply:Reply)-[:REPLIED_TO]->(c)
RETURN c, COLLECT(reply) AS replies
`

const createFestival = `
            CREATE (f:Festival {
                id: $id,
                Naam: $Naam
            })
            RETURN f.id AS id
        `;



module.exports = {
    connect,
    connectTest,
    session,
    addUser: "CREATE (n:User {userName: $userName, email: $email})",
    addFriend,
    acceptFriend,
    followee,
    unfollow,
    getFriends,
    getFollowers,
    getFollowed,
    addComment,
    addReply,
    getAllCommentsWithReplies,
    createFestival,
    followFriend,
    deleteFriend,
    dropAll: 'MATCH (n) DETACH DELETE n',

}