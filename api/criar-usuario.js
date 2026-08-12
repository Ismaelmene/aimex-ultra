const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

const SETORES_VALIDOS = [
  'veterinario', 'estrutural', 'maquinario',
  'nutricional', 'financeiro', 'admin'
];

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido' });
  }

  try {
    const authHeader = req.headers.authorization || '';
    const idToken = authHeader.replace('Bearer ', '');
    if (!idToken) return res.status(401).json({ erro: 'Token ausente' });

    const decoded = await admin.auth().verifyIdToken(idToken);
    const callerDoc = await db.collection('usuarios').doc(decoded.uid).get();
    if (!callerDoc.exists) return res.status(403).json({ erro: 'Usuário não cadastrado' });

    const caller = callerDoc.data();
    const { nome, email, telefone, senha, role, setor } = req.body;

    if (!nome || !email || !senha || !role) {
      return res.status(400).json({ erro: 'Campos obrigatórios faltando' });
    }
    if (senha.length < 6) {
      return res.status(400).json({ erro: 'Senha precisa ter no mínimo 6 caracteres' });
    }

    // Regras de quem pode cadastrar quem
    if (caller.role === 'proprietario') {
      if (role !== 'lider') {
        return res.status(403).json({ erro: 'Proprietário só cadastra líderes de setor' });
      }
      if (!SETORES_VALIDOS.includes(setor)) {
        return res.status(400).json({ erro: 'Setor inválido' });
      }
    } else if (caller.role === 'lider') {
      if (role !== 'funcionario') {
        return res.status(403).json({ erro: 'Líder só cadastra funcionários' });
      }
      // funcionário herda automaticamente o setor do líder
    } else {
      return res.status(403).json({ erro: 'Sem permissão para cadastrar usuários' });
    }

    const setorFinal = caller.role === 'lider' ? caller.setor : setor;

    const novoUsuario = await admin.auth().createUser({
      email,
      password: senha,
      displayName: nome,
    });

    await db.collection('usuarios').doc(novoUsuario.uid).set({
      nome,
      email,
      telefone: telefone || '',
      role,
      setor: setorFinal,
      lider_id: caller.role === 'lider' ? decoded.uid : null,
      status: 'ativo',
      criado_em: admin.firestore.FieldValue.serverTimestamp(),
      criado_por: decoded.uid,
    });

    return res.status(200).json({ sucesso: true, uid: novoUsuario.uid });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: err.message || 'Erro interno' });
  }
};
