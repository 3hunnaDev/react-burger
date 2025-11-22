import { useCallback, useState, type ChangeEvent } from "react";

type FormElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

type FormChangeEvent = ChangeEvent<FormElement>;

const useForm = <T extends Record<string, unknown>>(initialValues: T) => {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = useCallback((event: FormChangeEvent) => {
    const { name, value } = event.target;
    setValues(
      (prevValues) =>
        ({
          ...prevValues,
          [name]: value,
        } as T)
    );
  }, []);

  return { values, handleChange, setValues };
};

export default useForm;
