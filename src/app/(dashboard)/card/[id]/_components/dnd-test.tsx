"use client";

import { useState } from "react";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Edit2, Facebook, MoreVertical, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type SocialLink = {
  id: string;
  name: string;
};

export default function DndTest() {
  const [links, setLinks] = useState<SocialLink[]>([
    { id: "1", name: "Facebook" },
    { id: "2", name: "Facebook" },
    { id: "3", name: "Facebook" },
    { id: "4", name: "Facebook" },
    { id: "5", name: "Facebook" },
    { id: "6", name: "Facebook" },
  ]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const newLinks = Array.from(links);
    const [reorderedItem] = newLinks.splice(result.source.index, 1);
    newLinks.splice(result.destination.index, 0, reorderedItem);

    setLinks(newLinks);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleSave = (id: string, newName: string) => {
    setLinks(
      links.map((link) => (link.id === id ? { ...link, name: newName } : link))
    );
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setLinks(links.filter((link) => link.id !== id));
  };

  const handleAddLink = () => {
    const newId = (links.length + 1).toString();
    setLinks([...links, { id: newId, name: "New Link" }]);
  };

  return (
    <div className="mx-auto w-full max-w-md p-4">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="list">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {links.map((link, index) => (
                <Draggable key={link.id} draggableId={link.id} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Card>
                        <CardContent className="flex items-center justify-between p-4">
                          <div className="flex items-center space-x-2">
                            <Facebook className="h-5 w-5 text-blue-600" />
                            {editingId === link.id ? (
                              <Input
                                value={link.name}
                                onChange={(e) =>
                                  handleSave(link.id, e.target.value)
                                }
                                onBlur={() => setEditingId(null)}
                                className="w-32"
                              />
                            ) : (
                              <span>{link.name}</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(link.id)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(link.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
      <Button
        onClick={handleAddLink}
        className="mt-4 w-full bg-gray-100 text-gray-700 hover:bg-gray-200"
      >
        + Add Link
      </Button>
    </div>
  );
}
