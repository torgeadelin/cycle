import React from 'react'
import styled from 'styled-components'
import theme from '../theme'


const LinkElement = styled.a`
    background-color: ${theme.colors.lightGreen};
    color:  ${theme.colors.darkGreen};
    border-bottom: 1px solid ${theme.colors.darkGreen};
    font-size: 1.2rem;
    cursor: pointer;

`;

export default function Link(props) {
    return (
        <LinkElement {...props} />
    )
}
