"use client";

import { useState } from "react";
import { X, GripVertical } from "lucide-react";
import { FcPlus } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ReactSortable } from "react-sortablejs";
import { BsLightning } from "react-icons/bs";
import { Category, Cuisine, DifficulType } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAction } from "next-safe-action/hooks";
import { addRecipeAction, updateRecipeAction } from "@/app/_actions/recipes";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import ActionMessage from "@/components/common/action-message";
import { RecipeType } from "@/app/_actions/recipes/type";
import { Card, CardContent } from "@/components/ui/card";
import { FiPlus } from "react-icons/fi";
import UploadWidget from "@/components/common/upload-widget";
import Modal from "@/components/ui/modal";

type TStepType = {
  id: number;
  label: string;
  image?: string;
};

type TIngredientType = {
  id: number;
  label: string;
};

interface RecipeFormProps {
  cuisines: Cuisine[];
  categories: Category[];
  initialData?: RecipeType;
}

interface FormErrors {
  title?: string;
  description?: string;
  cuisine?: string;
  category?: string;
  prepTime?: string;
  cookTime?: string;
  servings?: string;
  difficulty?: string;
  ingredients?: string;
  steps?: string;
  image?: string;
}

export default function RecipeForm({
  cuisines,
  categories,
  initialData,
}: RecipeFormProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [ingredientText, setIngredientText] = useState<string>(
    initialData?.ingredients.map((item) => item.label).join("\n") || ""
  );

  const [ingredients, setIngredients] = useState<TIngredientType[]>(
    initialData?.ingredients.map((item) => ({
      id: item.order,
      label: item.label,
    })) || [
      {
        id: 1,
        label: "",
      },
    ]
  );
  const [steps, setSteps] = useState<TStepType[]>(
    initialData?.steps.map((item) => ({
      id: item.order,
      label: item.label,
      image: item.image || "",
    })) || [
      {
        id: 1,
        label: "",
        image: "",
      },
    ]
  );

  const [title, setTitle] = useState<string>(initialData?.title || "");
  const [description, setDescription] = useState<string>(
    initialData?.description || ""
  );
  const [cuisine, setCuisine] = useState<string>(initialData?.cuisine.id || "");
  const [category, setCategory] = useState<string>(
    initialData?.category.id || ""
  );
  const [image, setImage] = useState<string>(initialData?.image || "");
  const [prepTime, setPrepTime] = useState<number | "">(
    initialData?.prepTime || ""
  );
  const [cookTime, setCookTime] = useState<number | "">(
    initialData?.cookTime || ""
  );
  const [servings, setServings] = useState<number | "">(
    initialData?.servings || ""
  );
  const [difficulty, setDifficulty] = useState<DifficulType | undefined>(
    (initialData?.difficulty as DifficulType) || undefined
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const { toast } = useToast();

  const {
    execute: addExecute,
    isExecuting: addExecuting,
    result,
  } = useAction(addRecipeAction, {
    onSuccess: ({ data }) => {
      toast({
        title: "Recipe added!",
        description: format(new Date(), "MMMM do, yyyy"),
      });
    },
  });
  const { execute: updateExecute, isExecuting: updateExecuting } = useAction(
    updateRecipeAction,
    {
      onSuccess: ({ data }) => {
        toast({
          title: "Recipe updated!",
          description: format(new Date(), "MMMM do, yyyy"),
        });
      },
    }
  );

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = "Recipe title is required";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!description.trim()) {
      newErrors.image = "Image is required";
    }

    if (!cuisine) {
      newErrors.cuisine = "Please select a cuisine";
    }

    if (!category) {
      newErrors.category = "Please select a category";
    }
    if (!image) {
      newErrors.image = "Please select a image";
    }

    if (!prepTime) {
      newErrors.prepTime = "Prep time is required";
    } else if (prepTime < 0) {
      newErrors.prepTime = "Prep time cannot be negative";
    }

    if (!cookTime) {
      newErrors.cookTime = "Cook time is required";
    } else if (cookTime < 0) {
      newErrors.cookTime = "Cook time cannot be negative";
    }

    if (!servings) {
      newErrors.servings = "Number of servings is required";
    } else if (servings < 1) {
      newErrors.servings = "Servings must be at least 1";
    }

    if (!difficulty) {
      newErrors.difficulty = "Please select difficulty level";
    }

    if (ingredients.some((ing) => !ing.label.trim())) {
      newErrors.ingredients = "All ingredients must be filled out";
    }

    if (steps.some((step) => !step.label.trim())) {
      newErrors.steps = "All steps must be filled out";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      {
        id: ingredients.length + 1,
        label: "",
      },
    ]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const addStep = () => {
    setSteps([
      ...steps,
      {
        id: steps.length + 1,
        label: "",
        image: "",
      },
    ]);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      const firstError = document.querySelector(".error-message");
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (initialData) {
      updateExecute({
        categoryId: category,
        cookTime: Number(cookTime),
        cuisineId: cuisine,
        description: description,
        difficulty: difficulty as DifficulType,
        image,
        ingredients,
        steps,
        prepTime: Number(prepTime),
        servings: Number(servings),
        title,
        id: initialData?.id,
      });
    } else {
      addExecute({
        categoryId: category,
        cookTime: Number(cookTime),
        cuisineId: cuisine,
        description: description,
        difficulty: difficulty as DifficulType,
        image,
        ingredients,
        steps,
        prepTime: Number(prepTime),
        servings: Number(servings),
        title,
      });
    }
  };

  const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null;
    return <p className="text-red-500 text-sm mt-1 error-message">{message}</p>;
  };

  const handleQuickAddIngredient = () => {
    if (ingredientText.trim()) {
      const newIngredients: TIngredientType[] = ingredientText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "")
        .map((name, index) => ({ id: index, label: name }));

      setIngredients(newIngredients);
      setOpen(false);
      setIngredientText("");
    }
  };

  return (
    <>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <div className="space-y-2 mb-4">
          <h3 className="font-semibold text-xl">Add multiple ingredients</h3>
          <p className="text-sm text-muted-foreground">
            Paste your ingredient list here. Add one ingredient per line.
            Include the quantity (i.e. cups, tablespoons) and any special
            preparation (i.e. sifted, softened, chopped).
          </p>
        </div>
        <Textarea
          placeholder="Separate Ingredients with line breaks"
          value={ingredientText}
          className="h-72"
          onChange={(e) => setIngredientText(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-4">
          <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            variant="default"
            onClick={handleQuickAddIngredient}
          >
            Quick Add
          </Button>
        </div>
      </Modal>
      <Card className="max-w-3xl mx-auto p-6">
        <div className="flex items-center gap-2 mb-4">
          <FcPlus className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Add a Recipe</h1>
        </div>
        <p className="text-muted-foreground mb-8 text-sm">
          Uploading personal recipes is easy! Add yours to your favorites, share
          with friends, family, or the AllRecipes community.
        </p>
        <ActionMessage result={result} />
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="title">Recipe Title</Label>
            <Input
              id="title"
              placeholder="Give your recipe a title"
              className={`max-w-xl ${errors.title ? "border-red-500" : ""}`}
              value={title}
              disabled={addExecuting || updateExecuting}
              onChange={(e) => setTitle(e.target.value)}
            />
            <ErrorMessage message={errors.title} />
          </div>

          <div className="space-y-2">
            <Label>Photo</Label>
            <div className="flex space-y-2 flex-col">
              <div className="md:w-1/2 w-full">
                <UploadWidget
                  value={image}
                  disabled={addExecuting || updateExecuting ? true : false}
                  onChange={(url) => {
                    if (url) setImage(url);
                  }}
                  onRemove={() => setImage("")}
                />
              </div>
              <ErrorMessage message={errors.image} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              disabled={addExecuting || updateExecuting}
              id="description"
              placeholder="Share the story behind your recipe and what makes it special."
              className={`min-h-[100px] ${
                errors.description ? "border-red-500" : ""
              }`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <ErrorMessage message={errors.description} />
          </div>

          <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label>Cuisine</Label>
              <p className="text-sm text-muted-foreground">
                Select the cuisine for this recipe.
              </p>
              <Select
                disabled={addExecuting || updateExecuting}
                value={initialData?.cuisineId || cuisine}
                onValueChange={(value) => setCuisine(value)}
              >
                <SelectTrigger
                  className={errors.cuisine ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select Cuisine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {cuisines.map((cuisine) => (
                      <SelectItem
                        key={cuisine.id}
                        value={cuisine.id}
                        className="cursor-pointer"
                      >
                        {cuisine.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <ErrorMessage message={errors.cuisine} />
            </div>

            <div className="space-y-2">
              <Label>Categories</Label>
              <p className="text-sm text-muted-foreground">
                Select one or more categories for this recipe.
              </p>
              <Select
                onValueChange={(value) => setCategory(value)}
                disabled={addExecuting || updateExecuting}
                value={initialData?.categoryId || category}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id}
                        className="cursor-pointer"
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <ErrorMessage message={errors.category} />
            </div>
          </div>

          <div className="space-y-4">
            <Label>Additional information</Label>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label htmlFor="prepTime">Prep Time (minutes)</Label>
                <Input
                  disabled={addExecuting || updateExecuting}
                  id="prepTime"
                  type="number"
                  placeholder="e.g. 15"
                  value={prepTime}
                  onChange={(e) => setPrepTime(Number(e.target.value))}
                  className={"max-w-xl"}
                />
                <ErrorMessage message={errors.prepTime} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cookTime">Cook Time (minutes)</Label>
                <Input
                  disabled={addExecuting || updateExecuting}
                  id="cookTime"
                  type="number"
                  placeholder="e.g. 30"
                  value={cookTime}
                  onChange={(e) => setCookTime(Number(e.target.value))}
                  className="max-w-xl"
                />
                <ErrorMessage message={errors.cookTime} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="servings">Servings</Label>
                <Input
                  disabled={addExecuting || updateExecuting}
                  id="servings"
                  type="number"
                  placeholder="e.g. 4"
                  value={servings}
                  onChange={(e) => setServings(Number(e.target.value))}
                  className="max-w-xl"
                />
                <ErrorMessage message={errors.servings} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select
                  disabled={addExecuting || updateExecuting}
                  value={initialData?.difficulty || difficulty}
                  onValueChange={(value) => {
                    const type = value as DifficulType;
                    setDifficulty(type);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem
                        value={DifficulType.EASY}
                        className="cursor-pointer"
                      >
                        {DifficulType.EASY}
                      </SelectItem>
                      <SelectItem
                        value={DifficulType.MEDIUM}
                        className="cursor-pointer"
                      >
                        {DifficulType.MEDIUM}
                      </SelectItem>
                      <SelectItem
                        value={DifficulType.DIFFICULT}
                        className="cursor-pointer"
                      >
                        {DifficulType.DIFFICULT}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <ErrorMessage message={errors.difficulty} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Ingredients</Label>
            </div>
            <ErrorMessage message={errors.ingredients} />
            <p className="text-sm text-muted-foreground">
              Enter one ingredient per line. Include the quantity (i.e. cups,
              tablespoons) and any special preparation (i.e. sifted, softened,
              chopped). Use optional headers to organize the different parts of
              the recipe (i.e. Cake, Frosting, Dressing).
            </p>
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => setOpen(true)}
                type="button"
                variant="outline"
                size="sm"
              >
                <BsLightning />
                Quick add
              </Button>
            </div>

            <div className="space-y-2">
              <ReactSortable
                disabled={addExecuting || updateExecuting}
                list={ingredients}
                setList={setIngredients}
                className="space-y-3"
              >
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-pointer" />
                    <Input
                      disabled={addExecuting || updateExecuting}
                      placeholder="e.g. 2 cups flour, sifted"
                      value={ingredient.label}
                      onChange={(e) => {
                        const newIngredients = [...ingredients];
                        newIngredients[index].label = e.target.value;
                        setIngredients(newIngredients);
                      }}
                    />
                    <Button
                      disabled={addExecuting || updateExecuting}
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeIngredient(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </ReactSortable>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={addExecuting || updateExecuting}
                onClick={addIngredient}
                className="text-xs"
              >
                <FiPlus /> Add Ingredient
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Directions</Label>
            </div>
            <ErrorMessage message={errors.steps} />
            <p className="text-sm text-muted-foreground">
              Explain how to make your recipe, including oven temperatures,
              baking or cooking times, and pan sizes, etc. Use optional headers
              to organize the different parts of the recipe (i.e. Prep, Bake,
              Decorate).
            </p>
            <div className="space-y-2">
              <ReactSortable
                disabled={addExecuting || updateExecuting}
                list={steps}
                setList={setSteps}
                className="space-y-6"
              >
                {steps.map((step, index) => (
                  <div key={index} className="flex flex-col gap-4">
                    <Label className="text-sm text-muted-foreground ml-6">
                      Step {index + 1}
                    </Label>
                    <div className="flex items-start gap-4">
                      <GripVertical className="h-5 w-5 text-muted-foreground cursor-pointer mt-2" />
                      <div className="flex-1 space-y-4 ">
                        <Input
                          disabled={addExecuting || updateExecuting}
                          placeholder="e.g. Preheat oven to 350 degrees F..."
                          value={step.label}
                          onChange={(e) => {
                            const newSteps = [...steps];
                            newSteps[index].label = e.target.value;
                            setSteps(newSteps);
                          }}
                        />
                        <div className="w-24 h-24">
                          <UploadWidget
                            value={step.image || ""}
                            disabled={addExecuting || updateExecuting}
                            onChange={(url) => {
                              if (url) {
                                const newSteps = [...steps];
                                newSteps[index].image = url;
                                setSteps(newSteps);
                              }
                            }}
                            onRemove={() => {
                              const newSteps = [...steps];
                              newSteps[index].image = "";
                              setSteps(newSteps);
                            }}
                          />
                        </div>
                      </div>
                      <Button
                        disabled={addExecuting || updateExecuting}
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStep(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </ReactSortable>
            </div>
            <div className="flex justify-end">
              <Button
                disabled={addExecuting || updateExecuting}
                type="button"
                variant="outline"
                size="sm"
                onClick={addStep}
                className="text-xs"
              >
                <FiPlus /> Add Step
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={addExecuting || updateExecuting}
          >
            {addExecuting || updateExecuting
              ? "Submitting..."
              : "Submit Recipe"}
          </Button>
        </form>
      </Card>
    </>
  );
}
