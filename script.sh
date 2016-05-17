#!/usr/bin/env bash

common_opts="--progress --profile --colors --display-error-details --display-cached"
dev_opts="$common_opts --debug --devtool cheap-module-eval-source-map"
prod_opts="$common_opts --define process.env.NODE_ENV=\"production\" --optimize-occurence-order --optimize-minimize --optimize-dedupe"

build-dev() {
  webpack $dev_opts
}

build-prod() {
  webpack $prod_opts
}

watch() {
  webpack $dev_opts --watch
}

"$@"
