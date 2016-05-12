#!/usr/bin/env bash

common_opts="--progress --profile --colors --display-error-details --display-cached"
dev_opts="$common_opts --define process.env.NODE_ENV=\"dev\" --debug --devtool cheap-module-eval-source-map"

build-dev() {
  webpack $dev_opts
}

build-prod() {
  webpack $common_opts --optimize-occurence-order --optimize-minimize --optimize-dedupe
}

watch() {
  webpack $dev_opts --watch
}

"$@"
