import React from 'react'
import styled from 'styled-components'
import { space } from 'styled-system'
import { ReactComponent as Bike } from '../img/bike.svg'

const Wrapper = styled.div`
    display: flex;
    justify-content: flex-start;
    padding: 10px 0px;
`

const Text = styled.p`
    font-weight: bold;
    font-size: 1.2rem;
    ${space};
`
export default function NavBar() {
    return (
        <Wrapper>
            <Bike width="50" />
            <Text ml={2}>London</Text>
        </Wrapper>
    )
}
