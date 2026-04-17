#!/bin/bash

# URUTAN TAMPILAN (ini yang menentukan urutan)
server_order=(
  "ID-BIZNET-1"
  "ID-BIZNET-2"
  "ID-BIZNET-3"
  "ID-BIZNET-4"
  "ID-BIZNET-5"
  "ID-IKD-1"
)

# Alias => domain (domain tidak ditampilkan)
declare -A servers=(
  ["ID-BIZNET-1"]="biznet.rajaserverpremium.web.id"
  ["ID-BIZNET-2"]="biznet2.rajaserverpremium.web.id"
  ["ID-BIZNET-3"]="biznet3.rajaserverpremium.web.id"
  ["ID-BIZNET-4"]="biznet4.rajaserverpremium.web.id"
  ["ID-BIZNET-5"]="biznet5.rajaserverpremium.web.id"
  ["ID-IKD-1"]="ikd.rajaserverpremium.web.id"
)

# Port + label
declare -A ports=(
  [22]="VPS LOGIN"
)

green="\e[32m"; red="\e[31m"; nc="\e[0m"

echo "🔍 Cek status server"
echo "-------------------------------------------"

for alias in "${server_order[@]}"; do
  host="${servers[$alias]}"
  echo -e "\n🌐 Server: $alias"

  port=22
  timeout 2 bash -c "</dev/tcp/$host/$port" &>/dev/null
  if [[ $? -eq 0 ]]; then
    echo -e "  Port $port (${ports[$port]}): ${green}OPEN${nc}"
  else
    echo -e "  Port $port (${ports[$port]}): ${red}CLOSED${nc}"
  fi
done
