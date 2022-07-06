#! /bin/bash

FILE_PATH=/var/www/v2x-admin

# shellcheck disable=SC2010
for file_name in $(ls $FILE_PATH |grep "umi.*.js")
do
  file=${FILE_PATH}/${file_name}
  sed -i "s#APISERVER#${API_SERVER}#g" "$file"
done

# shellcheck disable=SC2010
for file_name in $(ls $FILE_PATH |grep "p__CloudPlatform.*.js")
do
  file=${FILE_PATH}/${file_name}
  sed -i "s#AMAPKEY#${MAP_KEY}#g" "$file"
done

# shellcheck disable=SC2010
for file_name in $(ls $FILE_PATH |grep "p__IntersectionMap.*.js")
do
  file=${FILE_PATH}/${file_name}
  sed -i "s#MQTTURL#${MQTT_URL}#g" "$file"
  sed -i "s#MQTTPATH#${MQTT_PATH}#g" "$file"
  sed -i "s#MQTTUSERNAME#${MQTT_USERNAME}#g" "$file"
  sed -i "s#MQTTPASSWORD#${MQTT_PASSWORD}#g" "$file"
done

./docker-entrypoint.sh

nginx -g "daemon off;"
