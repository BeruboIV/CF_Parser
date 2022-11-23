#!/bin/bash

FILES=$(ls *.cpp)
for FILE in ${FILES}; do
	EXECUTABLE=$(basename $FILE .cpp)
	test -f "${EXECUTABLE}" && rm -f "${EXECUTABLE}"
done