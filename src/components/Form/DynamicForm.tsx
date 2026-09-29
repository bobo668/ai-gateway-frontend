import React from 'react'
import { Form, FormProps, Input, Select, InputNumber, Switch, DatePicker, Radio, Checkbox, Slider } from 'antd'
import { useEffect, useState } from 'react'

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'multiSelect'
  | 'switch'
  | 'date'
  | 'dateRange'
  | 'radio'
  | 'checkbox'
  | 'slider'

export interface FormField {
  name: string
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  disabled?: boolean
  defaultValue?: unknown
  rules?: FormProps['rules']
  options?: { label: string; value: string | number }[]
  min?: number
  max?: number
  step?: number
  rows?: number
  autoSize?: { minRows: number; maxRows: number }
  onChange?: (value: unknown) => void
  visible?: boolean | ((values: Record<string, unknown>) => boolean)
  dependence?: string
  dependenceValue?: unknown
}

export interface DynamicFormProps {
  fields: FormField[]
  initialValues?: Record<string, unknown>
  onFinish: (values: Record<string, unknown>) => void
  onValuesChange?: (changedValues: Record<string, unknown>, values: Record<string, unknown>) => void
  layout?: 'horizontal' | 'vertical' | 'inline'
  labelCol?: { span: number }
  wrapperCol?: { span: number }
  size?: 'small' | 'middle' | 'large'
  children?: React.ReactNode
  disabled?: boolean
  readonly?: boolean
}

const renderField = (
  field: FormField,
  value: unknown,
  onChange: (value: unknown) => void,
  readonly: boolean,
) => {
  if (readonly) {
    const displayValue = field.options?.find((opt) => opt.value === value)?.label || String(value ?? '-')
    return <span>{displayValue}</span>
  }

  switch (field.type) {
    case 'text':
      return <Input placeholder={field.placeholder} disabled={field.disabled} />
    case 'textarea':
      return (
        <Input.TextArea
          placeholder={field.placeholder}
          disabled={field.disabled}
          rows={field.rows || 4}
          autoSize={field.autoSize}
        />
      )
    case 'number':
      return (
        <InputNumber
          placeholder={field.placeholder}
          disabled={field.disabled}
          min={field.min}
          max={field.max}
          style={{ width: '100%' }}
        />
      )
    case 'select':
      return (
        <Select placeholder={field.placeholder} disabled={field.disabled} options={field.options} />
      )
    case 'multiSelect':
      return (
        <Select
          placeholder={field.placeholder}
          disabled={field.disabled}
          options={field.options}
          mode="multiple"
        />
      )
    case 'switch':
      return <Switch disabled={field.disabled} checked={value as boolean} onChange={onChange} />
    case 'date':
      return <DatePicker style={{ width: '100%' }} disabled={field.disabled} />
    case 'dateRange':
      return <DatePicker.RangePicker style={{ width: '100%' }} disabled={field.disabled} />
    case 'radio':
      return <Radio.Group options={field.options} disabled={field.disabled} />
    case 'checkbox':
      return <Checkbox.Group options={field.options} disabled={field.disabled} />
    case 'slider':
      return (
        <Slider
          min={field.min}
          max={field.max}
          step={field.step}
          disabled={field.disabled}
          marks={field.min !== undefined && field.max !== undefined ? { [field.min]: String(field.min), [field.max]: String(field.max) } : undefined}
        />
      )
    default:
      return <Input placeholder={field.placeholder} disabled={field.disabled} />
  }
}

export default function DynamicForm({
  fields,
  initialValues,
  onFinish,
  onValuesChange,
  layout = 'vertical',
  labelCol = { span: 24 },
  wrapperCol = { span: 24 },
  size = 'middle',
  children,
  disabled = false,
  readonly = false,
}: DynamicFormProps) {
  const [form] = Form.useForm()
  const [formValues, setFormValues] = useState<Record<string, unknown>>(initialValues || {})

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues)
      setFormValues(initialValues)
    }
  }, [initialValues, form])

  const handleValuesChange = (changedValues: Record<string, unknown>, values: Record<string, unknown>) => {
    setFormValues(values)
    onValuesChange?.(changedValues, values)
  }

  const handleFinish = (values: Record<string, unknown>) => {
    onFinish(values)
  }

  const isFieldVisible = (field: FormField): boolean => {
    if (typeof field.visible === 'function') {
      return field.visible(formValues)
    }
    if (field.visible !== undefined) {
      return field.visible as boolean
    }
    return true
  }

  const visibleFields = fields.filter(isFieldVisible)

  return (
    <Form
      form={form}
      layout={layout}
      labelCol={layout === 'horizontal' ? labelCol : undefined}
      wrapperCol={layout === 'horizontal' ? wrapperCol : undefined}
      onFinish={handleFinish}
      onValuesChange={handleValuesChange}
      size={size}
      disabled={disabled}
    >
      {visibleFields.map((field) => (
        <Form.Item
          key={field.name}
          name={field.name}
          label={field.label}
          valuePropName={field.type === 'switch' ? 'checked' : 'value'}
          rules={field.rules}
          extra={
            field.type === 'slider' && field.min !== undefined && field.max !== undefined
              ? `${formValues[field.name] ?? field.min} / ${field.max}`
              : undefined
          }
        >
          {renderField(field, formValues[field.name], (val) => form.setFieldValue(field.name, val), readonly)}
        </Form.Item>
      ))}
      {children}
    </Form>
  )
}
