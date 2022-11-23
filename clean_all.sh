#!/bin/bash

FILES=$(ls *.cpp)
for FILE in ${FILES}; do
	EXECUTABLE=$(basename $FILE .cpp)
	test -f "${EXECUTABLE}" && rm -f "${EXECUTABLE}"
	rm -f ./${EXECUTABLE}*.in ./${EXECUTABLE}*.out
done