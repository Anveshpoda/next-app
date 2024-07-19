import React, { useEffect, useRef, useState } from 'react'
import { Select as Sal, MenuItem } from '@mui/material';

// import { randomIdGen } from '../../../utils/fun'
// import { useOutsideClickDetector } from '../../../hooks/useOutsideClickDetector'


const Select = ({ id, list, defaultValue, value, error, className, onChange, disabled, sx, label, style, ...props }) => {
    const [dList, setDList] = useState({})
    const [selectedValue, setSelectedValue] = useState("")
    const selectRef = useRef(null);
    // const [isOpen, setIsOpen] = useState(false)
    // const selectId = id || randomIdGen()
    // const closeSelect = () => setIsOpen(false)
    // useOutsideClickDetector(selectRef, closeSelect)

    useEffect(() => {
        if (!list || typeof list != 'object') return console.log(' >> Invalid List Data')
        let dL = {}
        if (Array.isArray(list)) dL = Object.fromEntries(list.map(l => [l, l]));
        else if (typeof list == 'object') { dL = Object.fromEntries(Object.entries(list).filter(([key, v]) => typeof v !== 'object')); }
        setDList(dL)
        // console.log('value >> ', dL, list, value)
        value && Object.keys(dL)?.includes(value) && setSelectedValue(value)
    }, [list])

    const onSelect = (e, l, n) => {
        e.preventDefault()
        // setIsOpen(false)
        setSelectedValue(l)
        onChange && onChange(l, n)
    }

    return (
        <div style={{...style}} className={`${className}`}>
            <Sal label={label} labelId={`${props.labelId || 'common-select-label'}`} id={`${props.selectId || 'common-select'}`}
                value={dList[selectedValue] || ''} disabled={disabled} error={error} ref={selectRef} sx={sx}
            >
                {Object.entries(dList)?.map(([v, n]) => <MenuItem key={v} name={n} value={v} onClick={(e) => onSelect(e, v, n)}>{n}</MenuItem>)}
            </Sal>
            {/* <div className={`errorText font11 mt-5  ${!error && 'dn'}`}> {error} </div> */}

        </div>
    )
}

export default Select