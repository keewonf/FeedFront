import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid #323238;
  background-color: #202024;

  .userImage {
    margin-right: 1rem; /* Espaço entre a foto e o campo de texto */
  }

  > form {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    
    textarea {
      width: 100%;
      background: #121214;
      border: 0;
      resize: none;
      height: 5rem;
      padding: 0.5rem;
      border-radius: 8px;
      color: #e1e1e6;
      line-height: 1.4;
      
    }

    footer {
      display: flex;
      justify-content: flex-end;
      padding-top: 0.5rem;
      border-top: 1px solid #323238;

      button {
        background-color: #00875f;
        border: 0;
        padding: 0.5rem 1rem;
        color: #fff;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;

        &:disabled {
          background-color: #323238;
          cursor: not-allowed;
        }
      }
    }
  }
`