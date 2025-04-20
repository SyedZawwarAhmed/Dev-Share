import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/notes/$id/posts/$postId/schedule/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/notes/$id/posts/$postId/schedule/"!</div>
}
