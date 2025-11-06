#!/bin/bash

info() { command echo $(date +"%Y-%m-%d %H:%M:%S") [INFO] "$0": "$@" >&2 ; }
error() { command echo $(date +"%Y-%m-%d %H:%M:%S") [ERROR] "$0": "$@" >&2; }

#######################################################################################

basedir=$(dirname "$(realpath $0)")
basefile=$(basename "$(realpath $0)")
basepath="${basedir}/${basefile}"

#######################################################################################

if [ -z "$1" ]; then
    port=7777
else
    port="$1"
fi

image="thirtysix361/browski"
innerport="8080"
containername="browski"

mkdir -p $basedir/mnt/
chmod -R 777 $basedir/mnt/

#######################################################################################

if docker inspect "${containername}_${port}" > /dev/null 2>&1; then
    docker rm -f "${containername}_${port}" > /dev/null 2>&1
    info "container on port $port undeployed"
# else
#     error "failed to undeploy container container on port $port"
#     error "container on port $port does not exist"
fi

if [ -n "$2" ]; then exit 1; fi

#######################################################################################

if ! docker network inspect network >/dev/null 2>&1; then
    docker network create network 2>&1
    info "Docker network 'network' created"
fi

#######################################################################################

response=$(docker run -d --restart unless-stopped --net=network --name "${containername}_${port}" \
    -p $port:$innerport \
    -v /etc/timezone:/etc/timezone:ro \
    -v /etc/localtime:/etc/localtime:ro \
    -v $basedir/mnt/scripts/:/home/browski/scripts/ \
    -v $basedir/mnt/sessions/:/home/browski/sessions/ \
    $image 2>&1)

if [ $? -eq 0 ]; then
    info "container on port $port deployed"
else
    error "failed to deploy container on port $port"
    error $response
fi

#######################################################################################
