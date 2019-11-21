import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
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
    autoFocus,
    handleChange,
    handleBlur,
    handleReady,
    handleKeyDown,
  } = props;

  const [value, setValue] = React.useState('');
  const inputRef = useRef(null);
  const fieldRef = useRef(null);

  useEffect(() => {
    if(text !== undefined && text !== null && text !== '') {
      setValue(text);
    }
    if(handleReady !== undefined) {
      handleReady(itemKey, fieldRef, inputRef);
    }

  }, []);

  return (
    <TextField
      id={"int-field-"+itemKey+'-'+label}
      label={label}
      ref={fieldRef}
      inputRef={inputRef}
      type="number"
      value={value}
      className={classes.textField}
      margin="normal"
      variant="standard"
      autoFocus={autoFocus!==undefined&&autoFocus===true ? true : false}
      InputProps={{
        endAdornment:
          <InputAdornment position="end">
            {(valueOk!==undefined&&valueOk===1) ? <CheckIcon color="primary" fontSize="small" /> : ''}
          </InputAdornment>
      }}
      onChange={(event) => {
        setValue(event.target.value);

        if(handleChange !== undefined) {
          handleChange(event, event.target.value, itemKey);
        }
      }}
      onBlur={(event) => {
        if(handleBlur !== undefined) {
          handleBlur(event, event.target.value, itemKey);
        }
      }}
      onKeyDown={(event) => {
        if(handleKeyDown !== undefined) {
          handleKeyDown(event, event.target.value, itemKey);
        }
      }}
    />
  );
}
IntField.propTypes = {
  itemKey: PropTypes.string.isRequired,
  name: PropTypes.string,
  label: PropTypes.string.isRequired,
  text: PropTypes.string,
  valueOk: PropTypes.number.isRequired,
  autoFocus: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleReady: PropTypes.func.isRequired,
  handleKeyDown: PropTypes.func.isRequired
};