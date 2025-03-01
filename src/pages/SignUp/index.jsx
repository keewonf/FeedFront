import { useState } from 'react'
import { FiMail, FiLock, FiUser, FiBriefcase} from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'

import { api } from '../../services/api'

import { Input } from '../../components/Input'
import { Button } from './styles'

import { Container, Form, Background } from './styles'
import igniteLogo from '../../assets/ignite-logo.svg';


export function SignUp() {
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  function handleSignUp(){
    event.preventDefault()
    if(!name || !email || !password || !role){
      return alert("Preencha todos os campos!")
    }

    api.post("/users", { name, role, email, password })
      .then(() => {
        alert("Usuário cadastrado com sucesso!")
        navigate('/')
      })
      .catch(error => {
        if(error.response){
          alert(error.response.data.message)
        } else {
            alert("Não foi possível cadastrar")
        }
      })
  }

  return(
    <Container>
      <Background />

      <Form>
        <img src={igniteLogo} alt="Logotipo do ignite" />
        <h1>Ignite Feed</h1>
        <p>Seu feed de comentários.</p>

        <h2>Crie sua conta</h2>

        <Input
          placeholder="Nome"
          type="text"
          icon={FiUser}
          onChange={e => setName(e.target.value)}
        />

        <Input
          placeholder="Função/Cargo"
          type="text"
          icon={FiBriefcase}
          onChange={e => setRole(e.target.value)}
        />

        <Input
          placeholder="E-mail"
          type="text"
          icon={FiMail}
          onChange={e => setEmail(e.target.value)}
        />
    
        <Input
          placeholder="Senha"
          type="password"
          icon={FiLock}
          onChange={e => setPassword(e.target.value)}
        />

        <Button onClick={handleSignUp}>
          Cadastrar
        </Button>

        <Link to='/'>
          Volte para o login
        </Link>
      </Form>

    </Container>
  )
}