---
layout: simple.post
title: Displaying current Git branch
categories: programming
---

Here's a handy little trick to show the current git branch in a Git repo. Open your terminal and add the following to your `.bash_profile`.

    function get_git_branch() {
        br=$(git rev-parse --abbrev-ref HEAD 2> /dev/null | sed 's/\(.*\)/\1/g')
        [ "" == "$br" ] && echo $(whoami) || echo "(($br))"
    }

    PS1="\h:\W \$(get_git_branch)\$ "

The idea is to show the current git branch whenever you enter a Git repository. After reloading your terminal, the current branch will now be displayed and your terminal prompt will look something like:

    czarpino:myproject ((master))$

The great thing about this is you now have a specific place to look at when you want to know your current branch. It also saves you precious keystrokes (as when typing `git status`).
