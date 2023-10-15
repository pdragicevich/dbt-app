import React, { useState } from 'react';
import { TextInput } from 'react-native-paper';

const LogLine = ({
  placeholder,
  initialValue,
  onChangeText,
  autoFocus,
}: {
  placeholder: string;
  initialValue: string;
  onChangeText: (text: string) => void;
  autoFocus?: boolean;
}) => {
  const [value, setValue] = useState(initialValue);
  function handleChanged(text: string) {
    setValue(text);
    onChangeText(text);
  }
  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={handleChanged}
      autoFocus={autoFocus}
      autoComplete="off"
      children={undefined}
      selectionColor="#000000"
    />
  );
};

export default LogLine;
