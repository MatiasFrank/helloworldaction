import { getInput, setOutput, setFailed } from "@actions/core";
import { context } from "@actions/github";
import { apiKey, auth } from "@nuntio/sdk/lib/auth";
import { UserIdentifier } from "@nuntio/api/model/user_pb";
import { CreateBuildRequest } from "@nuntio/api/api/v1/capsule/service_pb";
import { NuntioClient, nuntio, nuntioId } from "@nuntio/sdk/lib/nuntio";
import { UUID } from "@nuntio/api/model/uuid_pb.js";
import { Message, proto3 } from "@bufbuild/protobuf";

interface Inputs {
  username?: string;
  email?: string;
  phoneNumber?: string;
  password: string;
  url: string;
  image: string;
  msb: string;
  lsb: string;
  buildID?: string;
  projectID: string;
}

function makeUserIdentifier(inputs: Inputs): UserIdentifier {
  if (inputs.username !== undefined && inputs.username != "") {
    return UserIdentifier.fromJson({
      username: inputs.username,
    });
  }
  if (inputs.email !== undefined && inputs.email != "") {
    return UserIdentifier.fromJson({
      email: inputs.email,
    });
  }
  if (inputs.phoneNumber !== undefined && inputs.phoneNumber != "") {
    return UserIdentifier.fromJson({
      phoneNumber: inputs.phoneNumber,
    });
  }

  throw new Error("no identifier was chosen");
}

function getBuildID(inputs: Inputs): string {
  if (inputs.buildID !== undefined && inputs.buildID != "") {
    return inputs.buildID;
  }

  return context.sha.substring(0, 10);
}

async function action(inputs: Inputs) {
  console.log(inputs);

  let manager = auth();
  manager.setBaseURL(inputs.url);
  await manager.login(makeUserIdentifier(inputs), inputs.password);

  const uuid = UUID.fromJson({ msb: inputs.msb, lsb: inputs.lsb });
  const client = nuntio(inputs.projectID);
  client.setBaseURL(inputs.url);
  const buildID = getBuildID(inputs);
  await client.capsuleClient.createBuild(
    new CreateBuildRequest({
      buildId: buildID,
      image: inputs.image,
      capsuleId: uuid,
    }),
  );
  setOutput("buildID", buildID);
}

/*
try {
  action({
    email: "admin@nuntio.io",
    password: "TeamNuntio22!",
    url: "http://localhost:4747/",
    image: "9526fe5f94af",
    msb: "10131572704171216282",
    lsb: "12395029164007084783",
    buildID: "ghghg",
    projectID: "a918fa45-4d17-46ca-aee9-7ef16afa62bb",
  });
} catch (e: any) {
  setFailed(e.message);
}
*/

try {
  action({
    email: getInput("email"), //"admin@nuntio.io",
    username: getInput("username"), //"admin@nuntio.io",
    password: getInput("password"), //"TeamNuntio22!",
    url: getInput("url"), //"http://localhost:4747/",
    image: getInput("image"), //"9526fe5f94af",
    msb: getInput("msb"), //"10131572704171216282",
    lsb: getInput("lsb"), //"12395029164007084783",
    buildID: getInput("buildID"), //"someid",
    projectID: getInput("projectID"), //801004e6-0c97-4ac9-948c-e31144103986
  });
} catch (e: any) {
  setFailed(e.message);
}
