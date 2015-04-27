---
layout: cayman.post
title:  "Show Current Git Branch"
subtitle: "Automatically display the current Git branch when entering a Git repo"
date:   2015-04-27 16:44:14
categories: jekyll update
---

A few months ago, I learned a handy little trick to automatically show the current git branch in the command-line. Open your terminal and add the following to your `.bash_profile`.

    function get_git_branch() {
        br=$(git rev-parse --abbrev-ref HEAD 2> /dev/null | sed 's/\(.*\)/\1/g')
        [ "" == "$br" ] && echo $(whoami) || echo "(($br))"
    }
    
    PS1="\h:\W \$(get_git_branch)\$ "

This script will show the current git branch whenever you enter a Git repository. After reloading your terminal, the current branch will now be displayed and your terminal prompt will look something like:

    czarpino:myproject ((master))$


Now, have a specific place to look at when you want to know your current branch. It saves you precious keystrokes and eyeball movements.