import React, { ChangeEvent, useEffect, useState } from 'react'
import { Container, Typography, TextField, Button, Select, InputLabel, MenuItem, FormControl, FormHelperText } from "@material-ui/core"
import './CadastroProduto.css';
import {useNavigate, useParams } from 'react-router-dom'
import Categoria from '../../../model/Categoria';
import Produto from '../../../model/Produto';
import { busca, buscaId, post, put } from '../../../services/Service';
import { useDispatch, useSelector } from 'react-redux';
import { TokenState } from '../../../store/tokens/tokensReducer';
import Usuario from '../../../model/Usuario';
import { addToken } from '../../../store/tokens/actions';

function CadastroProduto() {
    const navigate = useNavigate();

    const token = useSelector<TokenState, TokenState["tokens"]>(
        (state) => state.tokens
    );

    const userId = useSelector<TokenState, TokenState['id']>(
        (state) => state.id
    )
  
    const dispatch = useDispatch()

    const { id } = useParams<{ id: string }>();

    // buscando o id dentro do REDUX
    const [categorias, setCategorias] = useState<Categoria[]>([])

    const [categoria, setCategoria] = useState<Categoria>({
        id: 0,
        descricao: '',
        produto: null
      });
    
    const [produto, setProduto] = useState<Produto>({
        id: 0,
        nome: '',
        descricao: '',
        foto: '',
        preco: 0,
        validade: '',
        regiao: '',
        fornecedor: '',
        unidade_de_medida: '',
        quantidade: 0,
        categoria: null,
        usuario: null
    })
        
    const [usuario, setUsuario] = useState<Usuario>({
        id: +userId,
        nome: '',
        usuario: '',
        senha: '',
        foto: '',
        data_nascimento: '',
        cpf: '',
        cnpj: '',
        cep: '',
        endereco: '',
        status_eco: '',
        produto: null
    })

    useEffect(() => {

        if(token === ''){ 
          alert('Ta tirando né??? sem token não rola')
          navigate('/login')
        }
      }, [])
    
      async function getCategorias() {
        try {
          await busca('/categorias', setCategorias, {
            headers: {

              Authorization: token,
            },
          });
        } catch (error: any) {
          if (error.toString().contains('403')) {
            alert('Token expirado, logue novamente');
            dispatch(addToken(''))
            navigate('/login');
          }
        }
      }
    
      async function getPostById(id: string) {
        await busca(`/produtos/${id}`, setProduto, {
          headers: {
            Authorization: token
          }
        })
      }
    
      useEffect(() => {
        getTemas();
        if(id !== undefined) {
          getPostById(id)
        }
      }, []);
    
      function updatedProduto(event: ChangeEvent<HTMLInputElement>) {
        setProduto({
          ...produto,
          [event.target.name]: event.target.value,
          categoria: categoria,
        });
      }
    
      useEffect(() => {
        setProduto({
          ...produto,
          categoria: categoria,
          usuario: usuario
        });
      }, [categoria]);
    
      async function onSubmit(event: ChangeEvent<HTMLFormElement>) {
        event.preventDefault();
    
        if (id !== undefined) {
          try {
            await put('/produtos', produto, setProduto, {
              headers: {
                Authorization: token,
              },
            });
            alert('foi - atualização')
            navigate('/produtos')
          } catch (error) {
            alert('deu erro');
          }
        } else {
          try {
            await post('/produtos', produto, setProduto, {
              headers: {
                Authorization: token,
              },
            });
            alert('foi - cadastro')
            navigate('/produtos')
          } catch (error) {
            alert('deu erro');
          }
        }
      }
    return (
        <Container maxWidth="sm" className="topo">
            <form onSubmit={onSubmit}>
                <Typography variant="h6" color="textSecondary" component="h6" align="center" >Formulário de cadastro de produtos</Typography>
                <TextField value={produto.nome} onChange={(e: ChangeEvent<HTMLInputElement>) => updatedProduto(e)} id="nome" label="Nome" variant="outlined" name="nome" margin="normal" fullWidth />
                <TextField value={produto.descricao} onChange={(e: ChangeEvent<HTMLInputElement>) => updatedProduto(e)} id="descricao" label="Descriçao" name="descricao" variant="outlined" margin="normal" fullWidth />
                <TextField value={produto.preco} onChange={(e: ChangeEvent<HTMLInputElement>) => updatedProduto(e)} id="preco" label="Preço" name="preco" variant="outlined" margin="normal" fullWidth />
                <TextField value={produto.fornecedor} onChange={(e: ChangeEvent<HTMLInputElement>) => updatedProduto(e)} id="fornecedor" label="Fornecedor" name="fornecedor" variant="outlined" margin="normal" fullWidth />
                <TextField value={produto.quantidade} onChange={(e: ChangeEvent<HTMLInputElement>) => updatedProduto(e)} id="quantidade" label="Quantidade" name="quantidade" variant="outlined" margin="normal" fullWidth />
                <TextField value={produto.regiao} onChange={(e: ChangeEvent<HTMLInputElement>) => updatedProduto(e)} id="regiao" label="Região" name="regiao" variant="outlined" margin="normal" fullWidth />
                <TextField value={produto.unidade_de_medida} onChange={(e: ChangeEvent<HTMLInputElement>) => updatedProduto(e)} id="unidade_de_medida" label="Unidade de Medida" name="unidade_de_medida" variant="outlined" margin="normal" fullWidth />
                <TextField value={produto.validade} onChange={(e: ChangeEvent<HTMLInputElement>) => updatedProduto(e)} id="validade" label="Validade" variant="outlined" name="validade" margin="normal" fullWidth />
                <TextField value={produto.foto} onChange={(e: ChangeEvent<HTMLInputElement>) => updatedProduto(e)} id="foto" label="Url da Foto" variant="outlined" name="foto" margin="normal" fullWidth />

                <FormControl >
                    <InputLabel id="demo-simple-select-helper-label">Categoria </InputLabel>
                    <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"
                        onChange={(e) => buscaId(`/categorias/${e.target.value}`, setCategoria, {
                            headers: {
                                'Authorization': token
                            }
                        })}>
                        {
                            categorias.map(categoria => (
                                <MenuItem value={categoria.id}>{categoria.descricao}</MenuItem>
                            ))
                        }
                    </Select>
                    <FormHelperText>Escolha uma categoria para o produto</FormHelperText>
                    <Button type="submit" variant="contained" color="primary">
                        Publicar Produto
                    </Button>
                </FormControl>
                <TextField value={produto.descricao} onChange={(e: ChangeEvent<HTMLInputElement>) => updatedProduto(e)} id="descricao" label="Descrição" name="descricao" variant="outlined" margin="normal" fullWidth />
            </form>
        </Container>
    )
}
export default CadastroProduto;