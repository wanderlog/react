import {prepareProfilingDataFrontendFromExport} from 'react-devtools-shared/src/devtools/views/Profiler/utils';
import {getCommitTree} from 'react-devtools-shared/src/devtools/views/Profiler/CommitTreeBuilder';
import fs from 'fs';
import yargs from 'yargs';

const {profile, commitIndex, outCommitTree, outDataFrontend} = yargs
  .command('$0')
  .option('profile', {
    type: 'string',
    demandOption: true,
    description: 'Profiling data saved from devtools',
  })
  .option('commit-index', {type: 'number', default: 0})
  .option('out-commit-tree', {type: 'string', default: 'commit-tree.json'})
  .option('out-data-frontend', {type: 'string', default: 'profiling-data-frontend.json'})
  .parse();

function replacer(key, value) {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()),
    };
  } else {
    return value;
  }
}

const profilingDataFrontend = prepareProfilingDataFrontendFromExport(
  JSON.parse(fs.readFileSync(profile, 'utf-8')),
);
const commitTree = getCommitTree({
  commitIndex: commitIndex,
  rootID: 1,
  profilerStore: {profilingData: profilingDataFrontend},
});

fs.writeFileSync(outCommitTree, JSON.stringify(commitTree, replacer), 'utf-8');
fs.writeFileSync(outDataFrontend, JSON.stringify(profilingDataFrontend, replacer), 'utf-8')
