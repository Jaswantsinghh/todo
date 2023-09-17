import React, { ReactNode, useState } from 'react';
import { EyeClosed, EyeOpen } from '@/icons';
// Define interfaces for the props
interface InputFieldProps {
  id?: string;
  className?: string;
  text?: string;
  input: string;
  setInput: (value: string) => void;
  name: string;
  type: string;
  errors?: string | Record<string, unknown>;
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean | undefined;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  Icon?: React.ElementType;
  hideMobileLabel?: boolean;
  autoComplete?: string;
  optional?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface FieldWrapperProps {
  className?: string;
  errors?: string | Record<string, unknown>;
  hideMobileLabel?: boolean;
  optional?: boolean;
  text?: string;
  children?: ReactNode;
}

export const InputField: React.FC<InputFieldProps> = ({
  id,
  className,
  text,
  input,
  setInput,
  name,
  type,
  errors,
  onKeyPress,
  disabled,
  onKeyDown,
  onClick,
  Icon,
  hideMobileLabel,
  autoComplete,
  optional,
  onChange,
}) => {
  const [password, showPassword] = useState(false);
  return (
    <FieldWrapper
      className={className || ''}
      text={text || ''}
      errors={errors || ''}
      hideMobileLabel={hideMobileLabel || false}
      optional={optional || false}
    >
      {Icon && <Icon className="input-field-container-icon" />}
      <input
        {...(id ? { id } : {})}
        type={type === 'password' ? (password ? 'text' : type) : type}
        disabled={disabled || false}
        name={name}
        className={`input ${type} ${errors ? 'error-message' : ''} ${Icon ? 'has-icon' : ''}`}
        placeholder={text || ''}
        value={input}
        onInput={(e) => setInput(e.currentTarget.value)}
        onClick={onClick}
        onKeyPress={onKeyPress}
        onKeyDown={onKeyDown}
        autoComplete={autoComplete || ''}
        onChange={onChange}
      />
      {type === 'password' &&
        (password ? (
          <EyeOpen className="password-icon" onClick={() => showPassword(false)} />
        ) : (
          <EyeClosed className="password-icon" onClick={() => showPassword(true)} />
        ))}
    </FieldWrapper>
  );
};

interface FieldWrapperProps {
  className?: string;
  errors?: string | Record<string, unknown>;
  hideMobileLabel?: boolean;
  optional?: boolean;
  text?: string;
}

const FieldWrapper: React.FC<FieldWrapperProps> = ({
  children,
  className,
  text,
  errors,
  hideMobileLabel,
  optional,
}) => (
  <div className={`input-field ${className || ''}`}>
    <div className="optional-fix">
      <label htmlFor="#" className={hideMobileLabel ? 'hide-mobile' : ''}>
        {text}
      </label>
      {optional ? <div className="input-field--optional"><p>OPTIONAL</p></div> : ''}
    </div>
    <div className="input-field-container">
      {children}
    </div>
    {errors && <span className="input-error">{`${errors}`}</span>}
  </div>
);
