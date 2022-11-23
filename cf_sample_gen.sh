#!/bin/bash

# Checking if we have proper arguments list or not
if [ $# -ne 1 ]; then
    echo "$(basename $0): improper arguments list"
    echo "Usage: cf_sample_gen contest_id"
    exit -1
fi

mkdir -p $1
cp Makefile $1
cp Templates/debug.h $1 

node codeforces.js $1

mv *.in *.out $1