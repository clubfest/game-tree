## About

Check out the [demo here](http://play.against.meteor.com)

I want to have multiple people explore a game tree
* joining means all players see the same state

## Game
Consist of
* rootId

## State
Consists of
* creatorId
* title
* remark
* commentIds

It cannot be removed or merged once someone else add things to it.

## Path
Consists of
* currentStateId
* backwardHistory
* forwardHistory

## User
Has
* subscriptions specified by
  * creatorId
  * gameId
