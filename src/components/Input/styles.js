import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;

  background-color: ${({ theme }) => theme.COLORS.gray_700};
  color: ${({ theme }) => theme.COLORS.gray_400};
  margin-bottom: 0.5rem;
  border-radius: 0.625rem;
  
  :focus {
    border-radius: 0.625rem;
  }
  

  > input {
    height: 3.5rem;
    width: 100%;
    padding: 0.75rem;
    padding-left: 2.75rem;
    
    color: ${({ theme }) => theme.COLORS.white};
    background: transparent;
    border: 0;

    &:placeholder {
      color: ${({ theme }) => theme.COLORS.gray_400};
    }

  }

  > svg {
      position: absolute;
      left: 0.8rem;
  }
`