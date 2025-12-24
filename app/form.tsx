import {Button, Card, Text, TextInput, DatePicker, Flex, MultiSelect, MultiSelectItem } from "@tremor/react";

export default async function Form() {

    return (
        <Card className="max-w-sm">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                }}
            >
                <Flex justifyContent="start" className="space-x-2 mt-2">
                    <Button size="xs" variant="secondary">
                        Find ride
                    </Button>
                    <Button size="xs" variant="primary">
                        Offer ride
                    </Button>
                </Flex>
                <MultiSelect  placeholder="Community" className="max-w-sm mx-auto mt-4">
                    <MultiSelectItem value="1" >
                        School
                    </MultiSelectItem>
                    <MultiSelectItem value="2">
                        Soccer Club
                    </MultiSelectItem>
                    <MultiSelectItem value="3">
                        Kindy
                    </MultiSelectItem>
                    <MultiSelectItem value="4">
                        Friends
                    </MultiSelectItem>
                </MultiSelect>
                <DatePicker className="max-w-sm mx-auto mt-4" />
                <TextInput placeholder="Time" className="max-w-sm mx-auto mt-4" />
                <TextInput placeholder="Pick up location" className="max-w-sm mx-auto mt-4"/>
                <TextInput placeholder="Drop off location" className="max-w-sm mx-auto mt-4"/>
                <Button size="xs" variant="secondary" className="max-w-sm mx-auto mt-4">
                    Public
                </Button>

                <Flex justifyContent="center" className="space-x-2 border-t pt-4 mt-8">
                    <Button type="submit" className="mt-2">
                        Submit
                    </Button>
                </Flex>
            </form>
        </Card>
    );
}
