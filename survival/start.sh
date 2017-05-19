#!/bin/bash
screen -dmS minecraft java -jar -server -Xmx2048M -Xms1024M minecraft.jar nogui
echo -e "Server is ready";
