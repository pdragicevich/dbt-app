import { useAppContext } from '../AppContext';
import Log from '../const/Log';
import AboutPopup from './AboutPopup/AboutPopup';
import OptionLog from './OptionLog/OptionLog';
import SkillSearch from './SkillSearch/SkillSearch';
import TextLog from './TextLog/TextLog';
import React, { useState } from 'react';
import { Appbar } from 'react-native-paper';

//const MORE_ICON = Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical';

interface AppHeaderState {
  searchVisible?: boolean;
  showOptionLogMenu?: boolean;
  optionLogId?: number;
  showTextLogMenu?: boolean;
  textLogId?: number;
  aboutVisible?: boolean;
}

const AppHeader = () => {
  const { config, setSnackbar } = useAppContext();

  const [state, setState] = useState<AppHeaderState>({});

  function onOptionLogDismiss(message: string) {
    setState({});
    setSnackbar({ message });
  }

  function onTextLogDismiss(message: string) {
    setState({});
    setSnackbar({ message });
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
        <Appbar.Action
          icon="emoticon-happy-outline"
          onPress={() => setState({ optionLogId: Log.Mood })}
        />
        <Appbar.Action
          icon="text-box-outline"
          onPress={() => setState({ textLogId: Log.Gratitude })}
        />
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
