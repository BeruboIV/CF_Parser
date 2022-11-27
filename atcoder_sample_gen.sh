#!/bin/bash

# Checking if we have proper arguments list or not
if [ $# -ne 1 ]; then
    echo "$(basename $0): improper arguments list"
    echo "Usage: atcoder_sample_gen contest_id (eg: arc152, abc123)"
    exit -1
fi

node atcoder.js $1
