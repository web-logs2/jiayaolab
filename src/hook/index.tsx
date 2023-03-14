import { useCallback, useEffect } from 'react'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../store'

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>()

export const useDebouncedEffect = (
  callback: () => void,
  delay: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deps: any
) => {
  const _callback = useCallback(callback, deps)
  useEffect(() => {
    const handler = setTimeout(() => {
      _callback()
    }, delay)
    return () => {
      clearTimeout(handler)
    }
  }, [_callback, delay])
}
