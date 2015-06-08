---
layout: simple.post
title: Open Git branching model
categories: programming
---

1. [Overview](#overview)
2. [Branches](#branches)
    - [Issue branch](#issue-branch)
    - [Release branch](#release-branch)
    - [Dev](#dev)
    - [Master](#master)
3. [Branching strategy](#branching-strategy)
    - [Development](#development)
    - [Release](#release)
    - [Maintenance](#maintenance)
4. [Sync merge](#)
5. [Merge request](#merge-request)
6. [Naming standards](#naming-standards)
7. [Conclusion](#conclusion)

# Overview

A branching model inspired by Gitflow and Pristine Trunk (of Subversion).

# Branches

Git's *cheap-local-branching* has allowed for a diverse number of possible branching models. There are 4 distinct types of branches in this model, each with a different purpose and life-cycle.

## Issue branch

An issue branch is a short-lived branch created, solely, to address an issue. It contains issue-specific changes (commits) and is typically used to isolate and facilitate asynchronous resolution of different issues (i.e. development).

An issue branch starts by branching off dev, master, release, or another issue branch. Relevant commits are made to the respective issue branch and, once development is done, it is merged back to it's parent branch. Afterwards, it may be discarded (recommended).

## Release branch

A release branch is another short-lived branch created to initiate the release cycle. It contains the latest production-ready version of the software and is used to parallelize deployment and the next stage of development i.e. deploying v1.0 while proceeding to work on v2.0.

A release branch starts by branching off dev branch. Release specific commits (e.g. configuration or bug fixes) may be made before it is finally merged to master branch. Bug fixes and general maintenance also happens on the release branch. It is discarded when the next release branch gets merged to master.

## Dev

Dev is a long-lived branch acting as the main line of development. It contains the bleeding edge version of the software and is the parent branch of all issue branches adding up to the next release.

The dev branch branches off master branch at the start of the project and goes on till the project's end.

## Master

Master is the longest-lived branch and contains the latest publicly released version of the software. Only release branches and urgent issue branches are ever merged into master branch. Every merge to master branch is tagged.

# Branching strategy

There are typically just 2 different types of branching strategy; one for development and another for deployment. It is easier to understand, however, when put into a familiar and practical development context i.e. development, release, and maintenance. These are general descriptions of the process; actual commands are ommitted.

## Development

The bulk of development is usually adding or enhancing features and comes in the form of resolving issues. For a typical issue, the development cycle proceeds with the following strategy:

1. An issue branch is created from dev
2. Relevant commits are made to resolve the issue
3. The issue branch is merged into dev

![image here]()

## Release

When the software has reached a stable state and is ready for release, the release cycle begins and proceeds with the following strategy:

1. A release branch is created from dev
2. The release branch is merged into master
3. A release tag is created from master
4. The release tag is deployed

![image here]()

## Maintenance

As no software is perfect, maintenance issues or *bugs* will eventually come up. The maintenance cycle proceeds with the following strategy:

1. An issue branch is created from release branch
2. Relevant commits are made to resolve the issue
3. The issue branch is merged into the release branch
4. The issue branch is merged into dev
5. The release branch is merged into master
6. A release tag is created from master
7. The release tag is deployed

![image here]()

# Sync merge

Sync merge is an abbreviation of *synchronization merge*. A sync merge brings a child branch back up-to-date with it's parent. This reduces the difference between the parent and child branch to only the changes made in the latter. This, consequently, ensures changes in the child branch are all that is merged back into the parent.

A sync merge is usually performed right before submitting a merge request. Best practice, however, is to regularly perform a sync merge to avoid resolving very large conflicts.

# Merge request

To manage released issues and keep the dev branch relatively stable, direct merges are discouraged in favor of merge requests. A merge request is exactly what it's name says, a request for merge. This allows the team to review the changes and hand pick issues to be included in the next release.

![a visual explanation of sync merge]()

# Branch naming

Branch naming conventions use the following legend:

- `name`: the literal 'name'
- `[name]`: 'name' will be replaced by another value

The branch naming conventions are as follows:

1. Master - `master`
2. Dev - `dev`
3. Release - `rb-[major-version].[minor-version]` e.g. `rb-1.0`, `rb-1.1`, etc.
4. Issue - `issue-[issue-number]` e.g. `issue-1`, `issue-2`, etc. where the issue number is the issue id as provided by the issue tracker

# Conclusion

When using Git, one of the most important things to set up is a branching strategy. A good branching strategy allows asynchronous development, gives fine control on what to deploy, and has a gentle learning and adoption curve.

Most parts of this branching strategy are not novel at all. This strategy is largely a digested version of different branching models presented elsewhere (some not even for Git). What I've collected here, however, are the bits and pieces that has worked well for me.
