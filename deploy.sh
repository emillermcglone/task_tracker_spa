#!/bin/bash
_build/prod/rel/task_tracker/bin/task_tracker_spa stop || true

cd assets 
export MIX_ENV=prod
export PORT=4011
npm install
node_modules/.bin/webpack --mode production
cd ..
mix phx.digest
mix compile
mix release --env=prod

_build/prod/rel/task_tracker_spa/bin/task_tracker_spa start