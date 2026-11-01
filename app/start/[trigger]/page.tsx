import Table from '@components/Table';
import TableColumn from '@components/TableColumn';
import TableRow from '@components/TableRow';
import { Footer } from '@root/site/Chrome';
import { LEAVES } from '@root/site/leaves';

export const metadata = { title: 'start | MOTIS.GROUP' };

export const dynamicParams = false;

export function generateStaticParams() {
  return [...new Set(LEAVES.map((l) => l.trigger))].map((trigger) => ({ trigger }));
}

export default function Redirect() {
  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/start/" />
      <link rel="canonical" href="/start/" />
      <Table>
        <TableRow>
          <TableColumn>
            Three questions first, so you land on the right page. <a href="/start/">Start here</a>.
          </TableColumn>
        </TableRow>
      </Table>
      <Footer active="START" />
    </>
  );
}
