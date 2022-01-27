// @mui
import { Container } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
// sections
import ListNewForm from '../../sections/list/ListNewForm';
// utils
import axios from '../../utils/axios';
// ---------------------------------------------------------------------

export default function NewList() {
  const { themeStretch } = useSettings();

  return (
    <Page title="New List">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <ListNewForm currentList={null} />
      </Container>
    </Page>
  );
}
