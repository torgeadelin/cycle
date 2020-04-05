import React from 'react'
import styled from 'styled-components'
import { space } from 'styled-system'
import { ReactComponent as Bike } from '../img/bike.svg'
import Link from '../components/Link'
const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0px;
`

const Flex = styled.div`
    display: flex;
    justify-content: flex-start;
`

const Text = styled.p`
    font-weight: bold;
    font-size: 1.2rem;
    ${space};
`
export default function NavBar() {
    return (
        <Wrapper>
            <Flex>
                <Bike width="50" />
                <Text ml={2}>London</Text>
            </Flex>

            <Link href="github">Github</Link>
        </Wrapper>
    )
}
