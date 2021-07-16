import {
  logger,
  consoleTransport,
  transportFunctionType,
} from 'react-native-logs';
import sqlDatabase from './Database/SQLDatabase';

const sqlTransport: transportFunctionType = props => {
  sqlDatabase.insertAppLog(props.level.text, props.msg).catch(reason => {
    console.error('sqlTransport error', reason);
  });
};

const appLog = logger.createLogger({
  transport: props => {
    consoleTransport(props);
    sqlTransport(props);
  },
  transportOptions: {
    colors: 'ansi',
  },
});

export default appLog;
