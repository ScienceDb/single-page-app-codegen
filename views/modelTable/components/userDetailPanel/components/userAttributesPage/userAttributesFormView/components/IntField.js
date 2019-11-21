import React, { useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import CheckIcon from '@material-ui/icons/Check';

const useStyles = makeStyles(theme => ({
  textField: {
    margin: 'auto',
    width: '100%',
    maxWidth: 300,
    minWidth: 200,
  },
}));

export default function IntField(props) {
  const classes = useStyles();
  const {
    itemKey,
    name,
    label,
    text,
    valueOk,
    handleChange,
    handleFocus,
    handleBlur,
    handleReady,
    handleKeyDown,
  } = props;
  
  const [value, setValue] = React.useState('');
  const inputRef = useRef(null);
  const textFieldRef = useRef(null);
  
  useEffect(() => {
    if(text !== undefined && text !== null && text !== '') {
      setValue(text);
    }

    if(handleReady !== undefined) {
      handleReady(itemKey, textFieldRef, inputRef);
    }

  }, []);

  return (
        <TextField
          id={"int-field-"+itemKey+'-'+label}
          label={label}
          ref={textFieldRef}
          inputRef={inputRef}
          type="number"
          value={value}
          className={classes.textField}
          margin="normal"
          variant="outlined"
          InputProps={{
            endAdornment:
              <InputAdornment position="end">
                {(valueOk!==undefined&&valueOk) ? <CheckIcon color="primary" fontSize="small" /> : ''}
              </InputAdornment>,
              readOnly: true
          }}
        />
  );
}