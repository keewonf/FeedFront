import styled from 'styled-components'
import backgroundImg from '../..//assets/background.jpg'

export const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: stretch;
`

export const Form = styled.form`
  padding: 0 8.5rem;
  
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  text-align: center;

  > h1 {
    font-size: 3rem;
    color: ${({ theme }) => theme.COLORS.white };
  }

  > h2 {
    font-size: 1.5rem;
    margin: 3rem 0;
  }

  > p {
    font-size: 0.95rem;
    color: ${({ theme }) => theme.COLORS.gray_200};
  }

  > a {
    margin-top: 7.75rem;
    text-decoration: none;
    color: ${({ theme }) => theme.COLORS.white };
  }
`

export const Button = styled.button`
  padding: 1rem 1.5rem;
  margin-top: 1rem;
  border-radius: 8px;
  border: 0;
  background-color: #00875f;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.1s;

  :hover {
    background: #00B37E;
  }

`

export const Background = styled.div`
  flex: 1;
  background: url(${backgroundImg}) no-repeat center center;
  background-size: cover;
`