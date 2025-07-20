import { useState } from 'react'
import { FiMail, FiLock } from 'react-icons/fi'
import { Link } from 'react-router-dom'

import { useAuth } from '../../hooks/auth'

import { Input } from '../../components/Input'
import { Button } from './styles'

import { Container, Form, Background } from './styles'
import igniteLogo from '../../assets/ignite-logo.svg';


export function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { signIn } = useAuth()

  async function handleSignIn(event){
    event.preventDefault()

    if (isSubmitting) return

    try {
      await signIn({ email, password })
    } catch (error) {
      console.error('Erro no login:', error)
      
    } finally {
      setIsSubmitting(false)
    }
  }

  return(
    <Container>
      <Form>
        <img src={igniteLogo} alt="Logotipo do ignite" />
        <h1>Ignite Feed</h1>
        <p>Seu feed de comentários.</p>

        <h2>Faça seu login</h2>

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

        <Button onClick={handleSignIn}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </Button>

        <Link to='/register'>
          Criar Conta
        </Link>
      </Form>

      <Background />
    </Container>
  )
}