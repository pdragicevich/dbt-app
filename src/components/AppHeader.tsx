import { useAppContext } from '../AppContext';
import LogType from '../const/LogType';
import LogDef from '../models/LogDef';
import AboutPopup from './AboutPopup/AboutPopup';
import OptionLog from './OptionLog/OptionLog';
import SkillSearch from './SkillSearch/SkillSearch';
import TextLog from './TextLog/TextLog';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { Appbar, Menu } from 'react-native-paper';

//const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

interface AppHeaderProps {
  setSnackbarMessage(message: string): void;
}
interface AppHeaderState {
  searchVisible?: boolean;
  showOptionLogMenu?: boolean;
  optionLogId?: number;
  showTextLogMenu?: boolean;
  textLogId?: number;
  aboutVisible?: boolean;
}

const AppHeader = (props: AppHeaderProps) => {
  const { db, config } = useAppContext();

  const [state, setState] = useState<AppHeaderState>({});
  const [logDefs, setLogDefs] = useState<LogDef[]>([]);

  useEffect(() => {
    async function initAppHeader() {
      const data = await db.readLogDefs();
      setLogDefs(data);
    }

    initAppHeader();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  function onOptionLogDismiss(msg: string) {
    setState({});
    props.setSnackbarMessage(msg);
  }

  function onTextLogDismiss(msg: string) {
    setState({});
    props.setSnackbarMessage(msg);
  }

  function show(val: number | undefined) {
    return val != null && val > 0;
  }

  function changeState(obj: Partial<AppHeaderState>) {
    const newState = { ...state, ...obj };
    setState(newState);
  }

  function showAbout() {
    changeState({ aboutVisible: true });
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title={config.appDisplayName} onPress={showAbout} />
        <Menu
          visible={!!state.showOptionLogMenu}
          onDismiss={() => setState({})}
          anchor={
            <Appbar.Action
              icon="emoticon-happy-outline"
              onPress={() => setState({ showOptionLogMenu: true })}
            />
          }
        >
          {logDefs
            .filter(x => x.type === LogType.Option)
            .map(l => (
              <Menu.Item
                key={l.id}
                onPress={() => setState({ optionLogId: l.id })}
                title={l.title}
              />
            ))}
        </Menu>
        <Menu
          visible={!!state.showTextLogMenu}
          onDismiss={() => setState({})}
          anchor={
            <Appbar.Action
              icon="text-box-outline"
              onPress={() => setState({ showTextLogMenu: true })}
            />
          }
        >
          {logDefs
            .filter(x => x.type === LogType.Text)
            .map(l => (
              <Menu.Item
                key={l.id}
                onPress={() => setState({ textLogId: l.id })}
                title={l.title}
              />
            ))}
        </Menu>
        <Appbar.Action
          icon="magnify"
          onPress={() => setState({ searchVisible: true })}
        />
      </Appbar.Header>
      {state.searchVisible && <SkillSearch onHide={() => setState({})} />}
      {show(state.optionLogId) && (
        <OptionLog
          logId={state.optionLogId ?? 0}
          onDismiss={onOptionLogDismiss}
        />
      )}
      {show(state.textLogId) && (
        <TextLog logId={state.textLogId ?? 0} onDismiss={onTextLogDismiss} />
      )}

      {state.aboutVisible && (
        <AboutPopup
          onDismiss={() => changeState({ aboutVisible: undefined })}
        />
      )}
    </>
  );
};

export default AppHeader;
