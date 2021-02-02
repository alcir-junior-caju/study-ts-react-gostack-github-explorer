import React, { useState, useEffect, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import api from '@services/api';

import logo from '@assets/github-explorer-logo.svg';

import { Error, Title, Form, Repositories } from './styles';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storageRepositories = localStorage.getItem(
      '@GithubExplorer:repositories'
    );

    if (storageRepositories) return JSON.parse(storageRepositories);

    return [];
  });

  useEffect(() => {
    localStorage.setItem(
      '@GithubExplorer:repositories',
      JSON.stringify(repositories)
    );
  }, [repositories]);

  const handleAddRepository = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    try {
      if (!newRepo) {
        setInputError('Digite o autor/nome do repositório!');
        return;
      }

      const response = await api.get<Repository>(`repos/${newRepo}`);
      const repository = response.data;

      setRepositories([...repositories, repository]);
      setNewRepo('');
      setInputError('');
    } catch (err) {
      setInputError('Erro na busca por esse repositório!');
    }
  };

  return (
    <>
      <img src={logo} alt="Github Explorer" />
      <Title>Explore repoistórios no Github</Title>

      <Form onSubmit={handleAddRepository} hasError={!!inputError}>
        <input
          value={newRepo}
          onChange={({ target: { value } }) => setNewRepo(value)}
          placeholder="Digite o nome do repositório"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map(
          ({ full_name, description, owner: { login, avatar_url } }) => (
            <Link key={full_name} to={`/repository/${full_name}`}>
              <img src={avatar_url} alt={login} />
              <div>
                <strong>{full_name}</strong>
                <p>{description}</p>
              </div>

              <FiChevronRight size={20} />
            </Link>
          )
        )}
      </Repositories>
    </>
  );
};

export default Dashboard;
