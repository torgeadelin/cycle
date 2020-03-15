import React from 'react'
import styled from 'styled-components'
import theme from '../theme'
import { space } from 'styled-system'

const ButtonElement = styled.div`
    background-color: ${p => p.selected ? theme.colors.darkGreen : theme.colors.lightGreen};
    padding: ${p => p.small ? "10px 40px" : "8px 25px"};
    color: ${p => p.selected ? theme.colors.white : theme.colors.darkGreen};
    font-size: ${p => p.small ? "0.9rem" : "1.3rem"};
    font-weight:bold;
    border-radius: 10px;
    display: inline-block;
    cursor: pointer;
    ${space};
`
export default function Button(props) {
    return (
        <ButtonElement {...props} />
    )
}
