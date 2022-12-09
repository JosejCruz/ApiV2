#!/bin/bash
#show home directory
echo $HOME
#show if folder Estudios exists in home directory
if [ -d $HOME/Estudios ]; then
#show current folder
pwd
echo "Estudios folder exists"
else
#make folder Estudios in home directory
mkdir $HOME/Estudios
echo "Estudios folder created"
#create Templates, Tmp and Final folders in Estudios folder
mkdir $HOME/Estudios/Templates
mkdir $HOME/Estudios/Tmp
mkdir $HOME/Estudios/Final
echo "Templates, Tmp and Final folders created"
#copy files from  ./Templates/docs folder to Estudios/Templates
cp -r $PWD/src/templates/docs/* $HOME/Estudios/Templates
fi