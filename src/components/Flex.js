import styled from 'styled-components';

const Flex = styled.div`
    display: flex;
    ${p => p.width && `width: ${p.width}`};
    flex-direction: ${p => (p.dir ? p.dir : 'row')};
    flex-wrap: ${p => (p.wrap ? p.wrap : 'nowrap')};
    justify-content: ${p => (p.justify ? p.justify : 'flex-start')};
    align-items: ${p => (p.align ? p.align : 'flex-start')};
`;

export default Flex;