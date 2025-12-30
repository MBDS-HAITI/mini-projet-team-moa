import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Typography,
  useTheme,
  alpha,
  Chip,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { useStudents, useCourses, useGrades, useUsers } from '../../hooks/useApi';
import StatCard from '../StatCard';
import QuickActionCard from '../QuickActionCard';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, CartesianGrid, XAxis, YAxis, ScatterChart, Scatter } from 'recharts';
import VerticalProgress from '../VerticalProgress';
// ...imports...



export default function Home() {
  const theme = useTheme();
  const { user } = useAuth();
  const role = user?.role || 'student';
  const { data: students } = useStudents();
  const { data: courses } = useCourses();
  const { data: grades } = useGrades();
  // Distribution des notes pour le PieChart
  const gradeDistribution = useMemo(() => {
    if (!grades || grades.length === 0) return [];
    // Grouper les notes par tranches (0-9, 10-11, 12-13, 14-15, 16-17, 18-20)
    const ranges = [
      { name: '0-9', min: 0, max: 9 },
      { name: '10-11', min: 10, max: 11 },
      { name: '12-13', min: 12, max: 13 },
      { name: '14-15', min: 14, max: 15 },
      { name: '16-17', min: 16, max: 17 },
      { name: '18-20', min: 18, max: 20 },
    ];
    return ranges.map(r => ({
      name: r.name,
      value: grades.filter(g => g.grade >= r.min && g.grade <= r.max).length,
    })).filter(d => d.value > 0);
  }, [grades]);
  // Données pour la croissance des inscriptions (exemple simple, à adapter selon vos données réelles)
  const studentGrowth = useMemo(() => {
    if (!students) return [];
    // Exemple : regrouper par année d'inscription si disponible, sinon par index
    // Remplacer par la vraie logique selon votre modèle de données
    return students.map((s, idx) => ({
      name: s.year || `Étudiant ${idx + 1}`,
      inscriptions: 1,
    }));
  }, [students]);

  // Actions rapides pour la section "Actions Rapides"
  const quickActions = [
    {
      title: 'Voir les étudiants',
      description: 'Gérer les dossiers étudiants',
      icon: '🎓',
      color: theme.palette.primary.main,
      to: '/students',
    },
    {
      title: 'Voir les cours',
      description: 'Consulter le catalogue de cours',
      icon: '📚',
      color: theme.palette.info.main,
      to: '/courses',
    },
    {
      title: 'Voir les notes',
      description: 'Consulter et saisir les notes',
      icon: '📝',
      color: theme.palette.success.main,
      to: '/grades',
    },
    {
      title: 'Utilisateurs',
      description: 'Gérer les comptes utilisateurs',
      icon: '👤',
      color: theme.palette.warning.main,
      to: '/users',
    },
  ];
  const { data: users } = useUsers();

  // Calcul des statistiques par cours pour les graphiques
  const courseStats = useMemo(() => {
    if (!courses || !grades) return [];
    // Pour chaque cours, calculer la moyenne et le nombre d'étudiants ayant une note
    return courses.map(course => {
      const courseGrades = grades.filter(g => g.course === course.id || g.course === course._id);
      const average = courseGrades.length > 0
        ? Math.round(courseGrades.reduce((sum, g) => sum + (g.grade || 0), 0) / courseGrades.length)
        : 0;
      return {
        name: course.name,
        average,
        count: courseGrades.length,
      };
    });
  }, [courses, grades]);

  const stats = useMemo(() => {
    const base = [
      { label: 'Étudiants', value: students?.length ?? 0, hint: 'Dossiers', icon: '🎓', color: theme.palette.primary.main },
      { label: 'Cours', value: courses?.length ?? 0, hint: 'Catalogue', icon: '📚', color: theme.palette.info.main },
      { label: 'Notes', value: grades?.length ?? 0, hint: 'Résultats', icon: '📝', color: theme.palette.success.main },
    ];
    if (role === 'admin') {
      base.splice(2, 0, { label: 'Utilisateurs', value: users?.length ?? 0, hint: 'Comptes', icon: '👤', color: theme.palette.warning.main });
    }
    return base;
  }, [students, courses, grades, users, role, theme.palette]);

  // COLORS et chartCards doivent être définis avant le return !
  const COLORS = [theme.palette.primary.main, theme.palette.info.main, theme.palette.success.main, theme.palette.warning.main, theme.palette.error.main];

  const chartCards = [
    grades && grades.length > 0 && {
      key: 'grades',
      content: (
        <Card
          sx={theme => ({
            width: 420,
            minWidth: 420,
            maxWidth: 420,
            height: 420,
            minHeight: 420,
            maxHeight: 420,
            background: theme.palette.mode === 'dark' ? '#181f2a' : '#fff',
            color: theme.palette.mode === 'dark' ? '#f1f5f9' : 'inherit',
            boxShadow: theme.palette.mode === 'dark'
              ? '0 16px 40px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.18)'
              : '0 12px 32px rgba(15,23,42,0.10), 0 1.5px 4px rgba(15,23,42,0.08)',
            borderRadius: 2,
            border: theme.palette.mode === 'dark' ? '1.5px solid #232b3b' : '1px solid #e2e8f0',
            transition: 'all 0.3s',
            display: 'flex',
            flexDirection: 'column',
            '&:hover': {
              boxShadow: theme.palette.mode === 'dark'
                ? '0 24px 56px rgba(0,0,0,0.55), 0 4px 12px rgba(0,0,0,0.22)'
                : '0 18px 40px rgba(15,23,42,0.13), 0 2px 8px rgba(15,23,42,0.10)',
              transform: 'translateY(-4px) scale(1.03)',
            },
          })}
        >
          <Box sx={{ px: 2, pt: 2 }}>
            <Typography variant="overline" sx={{ color: theme.palette.text.secondary }}>
               Tableau des beignets
             </Typography>
           </Box>
           <CardHeader title="Distribution des Notes" />
          <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={90}
                  innerRadius={54}
                  dataKey="value"
                  labelStyle={{ fontSize: 18, fontWeight: 700, fill: theme.palette.text.primary }}
                >
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 18, color: theme.palette.text.primary, fontWeight: 600 }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 16, fontWeight: 600, marginTop: 36 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ),
    },
    students && students.length > 0 && {
      key: 'students',
      content: (
        <Card
          sx={theme => ({
            height: '100%',
               background: theme.palette.mode === 'dark' ? '#181f2a' : '#fff',
               color: theme.palette.mode === 'dark' ? '#f1f5f9' : 'inherit',
               boxShadow: theme.palette.mode === 'dark'
                 ? '0 16px 40px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.18)'
                 : '0 12px 32px rgba(15,23,42,0.10), 0 1.5px 4px rgba(15,23,42,0.08)',
               borderRadius: 2,
               border: theme.palette.mode === 'dark' ? '1.5px solid #232b3b' : '1px solid #e2e8f0',
               transition: 'all 0.3s',
               display: 'flex',
               flexDirection: 'column',
               '&:hover': {
                 boxShadow: theme.palette.mode === 'dark'
                   ? '0 24px 56px rgba(0,0,0,0.55), 0 4px 12px rgba(0,0,0,0.22)'
                   : '0 18px 40px rgba(15,23,42,0.13), 0 2px 8px rgba(15,23,42,0.10)',
                 transform: 'translateY(-4px) scale(1.03)',
               },
          })}
        >
          <Box sx={{ px: 2, pt: 2 }}>
            <Typography variant="overline" sx={{ color: theme.palette.text.secondary }}>
              Courbes
            </Typography>
          </Box>
          <CardHeader title="Croissance des Inscriptions" />
          <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={studentGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 18, fontWeight: 600 }} />
                <YAxis tick={{ fontSize: 18, fontWeight: 600 }} />
                <Tooltip contentStyle={{ fontSize: 18 }} />
                <Line
                  type="monotone"
                  dataKey="inscriptions"
                  stroke={theme.palette.primary.main}
                  strokeWidth={3}
                  dot={{ fill: theme.palette.primary.main, r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 16, fontWeight: 600, marginTop: 36 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ),
    },
    courseStats.length > 0 && {
      key: 'course-progress',
      content: (
        <Card
          sx={theme => ({
            height: '100%',
            background: theme.palette.mode === 'dark' ? '#181f2a' : '#fff',
            color: theme.palette.mode === 'dark' ? '#f1f5f9' : 'inherit',
            boxShadow: theme.palette.mode === 'dark'
              ? '0 16px 40px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.18)'
              : '0 12px 32px rgba(15,23,42,0.10), 0 1.5px 4px rgba(15,23,42,0.08)',
            borderRadius: 2,
            border: theme.palette.mode === 'dark' ? '1.5px solid #232b3b' : '1px solid #e2e8f0',
            transition: 'all 0.3s',
            '&:hover': {
              boxShadow: theme.palette.mode === 'dark'
                ? '0 24px 56px rgba(0,0,0,0.55), 0 4px 12px rgba(0,0,0,0.22)'
                : '0 18px 40px rgba(15,23,42,0.13), 0 2px 8px rgba(15,23,42,0.10)',
              transform: 'translateY(-4px) scale(1.03)',
            },
          })}
        >
          <Box sx={{ px: 2, pt: 2 }}>
            <Typography variant="overline" sx={{ color: theme.palette.text.secondary }}>
              Barre de progression verticale
            </Typography>
          </Box>
          <CardHeader title="Moyenne par Cours" />
          <CardContent sx={{ minHeight: 260, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, overflowX: 'auto', pb: 1 }}>
              {courseStats.map((c) => (
                <Box key={c.name} sx={{ textAlign: 'center', minWidth: 40 }}>
                  <VerticalProgress value={c.average} color={theme.palette.primary.main} />
                  <Typography variant="caption" noWrap sx={{ mt: 0.5 }}>
                    {c.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                    {c.average}%
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      ),
    },
    courseStats.length > 0 && {
      key: 'course-scatter',
      content: (
        <Card
          sx={theme => ({
            height: '100%',
            background: theme.palette.mode === 'dark' ? '#181f2a' : '#fff',
            color: theme.palette.mode === 'dark' ? '#f1f5f9' : 'inherit',
            boxShadow: theme.palette.mode === 'dark'
              ? '0 16px 40px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.18)'
              : '0 12px 32px rgba(15,23,42,0.10), 0 1.5px 4px rgba(15,23,42,0.08)',
            borderRadius: 2,
            border: theme.palette.mode === 'dark' ? '1.5px solid #232b3b' : '1px solid #e2e8f0',
            transition: 'all 0.3s',
            '&:hover': {
              boxShadow: theme.palette.mode === 'dark'
                ? '0 24px 56px rgba(0,0,0,0.55), 0 4px 12px rgba(0,0,0,0.22)'
                : '0 18px 40px rgba(15,23,42,0.13), 0 2px 8px rgba(15,23,42,0.10)',
              transform: 'translateY(-4px) scale(1.03)',
            },
          })}
        >
          <Box sx={{ px: 2, pt: 2 }}>
            <Typography variant="overline" sx={{ color: theme.palette.text.secondary }}>
              Nuage de points
            </Typography>
          </Box>
           <CardHeader title="Relation Moyenne vs Étudiants" />
          <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height={260}>
              <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="average" name="Moyenne" domain={[0, 100]} tick={{ fontSize: 18, fontWeight: 600 }} />
                <YAxis type="number" dataKey="count" name="Étudiants" tick={{ fontSize: 18, fontWeight: 600 }} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ fontSize: 18 }} />
                <Scatter name="Cours" data={courseStats} fill={theme.palette.info.main} />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 16, fontWeight: 600 }} />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ),
    },
  ].filter(Boolean);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Card sx={{ mb: 4, border: `1px solid ${theme.palette.divider}` }}>
        <CardContent sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 2 }}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                mb: 0.5,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Plateforme MBDS
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Gestion académique centralisée — supervision, sécurité, pilotage et rôles différenciés.
            </Typography>
          </Box>

          <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary, display: 'block' }}>
              Utilisateur connecté
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {user?.name || user?.username || 'Invité'}
            </Typography>
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
              Rôle : {role}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Stats Row */}
      <Grid container spacing={6} sx={{ mb: 5 }}>
        {stats.map((s) => (
          <Grid item xs={12} sm={6} md={3} key={s.label}>
            <StatCard label={s.label} value={s.value} hint={s.hint} color={s.color} icon={s.icon} />
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      {chartCards.length > 0 && (
  <Card
    sx={theme => ({
      mb: 4,
      background: theme.palette.mode === 'dark' ? '#181f2a' : '#fff',
      color: theme.palette.mode === 'dark' ? '#f1f5f9' : 'inherit',
      boxShadow: theme.palette.mode === 'dark'
        ? '0 16px 40px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.18)'
        : '0 12px 32px rgba(15,23,42,0.10), 0 1.5px 4px rgba(15,23,42,0.08)',
      borderRadius: 2,
      border: theme.palette.mode === 'dark' ? '1.5px solid #232b3b' : '1px solid #e2e8f0',
      transition: 'all 0.3s',
    })}
  >
          <CardHeader
            title="Analyses principales"
            subheader="Visualisez rapidement les tendances clés"
            titleTypographyProps={{ variant: 'h5', fontWeight: 800 }}
            subheaderTypographyProps={{ variant: 'body1' }}
          />
          <CardContent>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
              <Chip label="Beignets" size="small" color="primary" variant="outlined" />
              <Chip label="Courbes" size="small" color="secondary" variant="outlined" />
              <Chip label="Barre de progression" size="small" color="success" variant="outlined" />
              <Chip label="Nuage de points" size="small" color="info" variant="outlined" />
            </Box>
            <Box
              sx={theme => ({
                display: 'flex',
                flexWrap: 'nowrap',
                justifyContent: 'center',
                alignItems: 'stretch',
                gap: theme.palette.mode === 'light' ? 0.5 : 3,
                width: '100%',
                overflowX: 'auto',
                pb: 1,
                pl: 0,
                pr: 0,
                background: 'inherit',
              })}
            >
              {chartCards.map((chart) => (
                <Box
                  key={chart.key}
                  sx={{
                    width: 440,
                    minHeight: 420,
                    display: 'flex',
                    alignItems: 'stretch',
                    justifyContent: 'center',
                    m: 0,
                    p: 0,
                  }}
                >
                  {chart.content}
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions Section */}
      <Card sx={{ mb: 4 }}>
        <CardHeader
          title="Actions Rapides"
          subheader="Accédez aux fonctionnalités principales"
        />
        <CardContent>
          <Grid container spacing={2}>
            {quickActions.map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item.title}>
                <QuickActionCard
                  title={item.title}
                  description={item.description}
                  icon={item.icon}
                  color={item.color}
                  onClick={() => navigate(item.to)}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Checklist Section */}
      <Card>
        <CardHeader
          title="Plan de Contrôle"
          subheader="Checklist rapide pour fiabiliser la base de données"
        />
        <CardContent>
          <Grid container spacing={2}>
            {[
              'Vérifier les accès Admin/Scolarité/Étudiant',
              'Compléter les profils utilisateurs',
              'Importer ou saisir les étudiants manquants',
              'Contrôler le catalogue des cours',
            ].map((item, idx) => (
              <Grid item xs={12} sm={6} key={idx}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: theme.palette.success.main,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </Box>
                  <Typography variant="body2">{item}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
}
