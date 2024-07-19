import { TextFieldProps } from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { useLazyListUsersQuery } from '../api';
import { usernameDuplicateCheckFailureErrorMessage, usernameDuplicateErrorMessage } from '../utils/messages';

interface UseTextFieldParams {
  defaultValue?: string;
  validator?: (value: string) => string | null;
  sanitizer?: (value: string) => string;
  error?: string | null;
  hideError?: boolean;
}

interface UseUsernameFieldParams extends UseTextFieldParams {
  listUserQuery: ReturnType<typeof useLazyListUsersQuery>;
}

const defaultSanitizer = (value: string) => value.trim();

export const useTextField = (params?: UseTextFieldParams) => {
  const defaultValue = params?.defaultValue ?? '';
  const [value, setValue] = useState(defaultValue);
  const [isTouched, setIsTouched] = useState(false);
  const [displayError, setDisplayError] = useState(false);
  const isEmpty = value.length === 0;
  const error = params?.error ?? (params?.validator ? params.validator(value) : null);
  const isValid = !error;
  const sanitize = () => {
    if (params?.sanitizer) setValue(params.sanitizer(value));
    else setValue(defaultSanitizer(value));
  };

  const onChange: TextFieldProps['onChange'] = event => {
    if (!isTouched) setIsTouched(true);
    setValue(event.target.value);
  };

  const onBlur: TextFieldProps['onBlur'] = () => {
    if (isTouched) setDisplayError(true);
    sanitize()
  };

  const clear = () => {
    setValue('');
    setIsTouched(false);
    setDisplayError(false);
  };

  return {
    fieldProps: {
      value, onChange, onBlur,
      error: displayError && !!error,
      helperText: (!params?.hideError && displayError) ? error : undefined,
    },
    isValid, isTouched, setValue, isEmpty, clear
  }
};


// const filledArray = <T extends any>(value: T, count: number) => Array(count).fill(value);
// const arraySetState = <T extends any>(setState: React.Dispatch<React.SetStateAction<T[]>>, value: T, index: number) => {
//   setState(state => ([...state.slice(0, index), value, ...state.slice(index)]));
// };

// export const useTextFields = (params?: UseTextFieldsParams) => {
//   const defaultCount = params?.count ?? params?.defaultValue?.length ?? 1;
//   const defaultValues = params?.defaultValues?.map(v => v ?? '')
//     ?? filledArray(params?.defaultValue ?? '', defaultCount);
//   const validators: (((value: string) => string | null))[] = params?.validator ? filledArray(params.validator, defaultCount) : filledArray(() => null, defaultCount);
//   const [values, setValues] = useState(defaultValues);
//   const [isTouched, setIsTouched] = useState(filledArray(false, defaultCount));
//   const [displayError, setDisplayError] = useState(filledArray(false, defaultCount));
//   const isEmpty = values.map(v => v.length === 0);
//   const errors = params?.errors ?? (values.map((v, i) => validators[i](v)));
//   const isValid = errors.map(err => !err);
//   const sanitize = (index: number) => arraySetState(setValues, (params?.sanitizer ? params.sanitizer(values[index], index) : defaultSanitizer(values[index])), index);


//   const onChange: TextFieldProps['onChange'][] = values.map((v, i) => (
//     event => {
//       if (!isTouched[i]) setIsTouched([...isTouched.slice(0, i), true,]);
//       arraySetState(setValues, event.target.value, i);
//     }
//   ));

//   const onBlur: TextFieldProps['onBlur'][] = values.map((v, i) => (
//     event => {
//       if (isTouched[i]) arraySetState(setDisplayError, true, i);
//       sanitize(i);
//     }
//   ));

//   const clear = (index: number) => {
//     arraySetState(setValues, '', index);
//     arraySetState(setIsTouched, false, index);
//     arraySetState(setDisplayError, false, index);
//   };

//   const clearAll = () => {
//     setValues(['']);
//     setIsTouched([false]);
//     setDisplayError([false]);
//   };
//   const add = () => { };
//   const remove = () => { };

//   return {
//     fieldProps: {
//       value, onChange, onBlur,
//       error: displayError && !!error,
//       helperText: displayError ? error : undefined,
//     },
//     isValid, isTouched, setValue, isEmpty, clear
//   }
// };


export const useUsernameField = ({ listUserQuery: [listUser, { isError }], ...params }: UseUsernameFieldParams) => {
  const { fieldProps: {
    error: baseError,
    helperText: baseHelperText,
    onBlur: baseOnBlur,
    onChange: baseOnChange,
    ...fieldPropsRest }, isValid: baseIsValid, ...rest } = useTextField(params);
  const [usernameDuplicateError, setUsernameDuplicateError] = useState<string | null>(null);

  const error = !!usernameDuplicateError || baseError;
  const helperText = usernameDuplicateError ?? baseHelperText;
  const isValid = !usernameDuplicateError && baseIsValid;

  useEffect(() => {
    if (isError) setUsernameDuplicateError(usernameDuplicateCheckFailureErrorMessage);
  }, [isError]);

  const checkUsernameDuplicate = async () => {
    if (isValid) {
      const { data } = await listUser({ params: { username: fieldPropsRest.value } });
      if (!data) setUsernameDuplicateError(usernameDuplicateCheckFailureErrorMessage);
      else if (data.length > 0) setUsernameDuplicateError(usernameDuplicateErrorMessage);
      else setUsernameDuplicateError(null);
    }
  };

  const onBlur: typeof baseOnBlur = event => {
    baseOnBlur(event);
    checkUsernameDuplicate();
  };

  const onChange: typeof baseOnChange = event => {
    baseOnChange(event);
    setUsernameDuplicateError(null);
  };

  return {
    fieldProps: {
      error, helperText, onBlur, onChange,
      ...fieldPropsRest
    },
    isValid, ...rest
  };
};