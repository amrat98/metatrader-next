"use client";
import React, { useState, useEffect } from "react";
import { useContext } from "react";
import axios from "axios";
import { apiConfig } from "@/lib/api-config";
import { ChevronRight, ChevronDown, Search, User, GitFork, Waypoints, Workflow } from "lucide-react";
import { UserContext } from "@/lib/usercontent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AvatarImage, Avatar } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/lib/utils";
import { Pagination } from "@/components/pagination";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from "@/components/ui/skeleton";

// Define User and ExpandedNodes types
interface User {
  id: string | number;
  username: string;
  nickName?: string;
  fullName?: string;
  planSubscription?: boolean;
  planPrice?: string | number;
  referralCode: string;
  level: number;
  child?: User[];
  isRoot?: boolean;
}

interface UserResult {
  id?: string;
  nickName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  referralCode?: string;
  mobileNumber?: string;
  planSubscription?: boolean;
  planPrice?: string | number;
}

type ExpandedNodes = Record<string, boolean>;

export default function TreeView() {
  const { profile, userToken } = useContext(UserContext) || {};
  const [data, setData] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeLevel, setActiveLevel] = useState<string>("all");
  const [expandedNodes, setExpandedNodes] = useState<ExpandedNodes>({});
  const [maxLevel, setMaxLevel] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [listPage, setListPage] = useState(1);
  const [activeTab, setActiveTab] = useState<string>("treeAll");
  const listPageSize = 50;

  // Reset pagination to first page when search or level changes
  useEffect(() => {
    setListPage(1);
  }, [searchQuery, activeLevel]);

  // Determine leg value based on activeTab
  const getLegFromTab = (tab: string): string => {
    switch (tab) {
      case "treeA":
      case "listA":
        return "A";
      case "treeB":
      case "listB":
        return "B";
      default:
        return "ALL";
    }
  };

  const findMaxLevel = (users: User[], currentLevel = 0): number => {
    let max = currentLevel;
    if (!Array.isArray(users)) return max;

    users.forEach((user) => {
      if (user.level >= max) {
        max = user.level;
      }
      if (user.child && Array.isArray(user.child)) {
        const childMax = findMaxLevel(user.child, max);
        if (childMax >= max) {
          max = childMax;
        }
      }
    });
    return max;
  };

  const fetchTreeData = async (leg: string) => {
    if (!userToken) return;
    const headers = {
      "Content-Type": "application/json",
      token: userToken,
    };
    try {
      setIsLoading(true);
      const response = await axios.get(`${apiConfig?.team?.teamList}?leg=${leg}`, { headers });
      //console.log(response);
      const userResult = profile?.userResult as UserResult;
      const newData: User = {
        id: userResult?.id || "",
        level: 0,
        referralCode: userResult?.referralCode || "",
        username: userResult?.nickName || "",
        planSubscription: userResult?.planSubscription || false,
        planPrice: userResult?.planPrice || "0",
        child: response?.data?.result || [],
      };
      setData(newData);
      //console.log(response);
      // Calculate max level after setting data
      const max = findMaxLevel([newData]);
      setMaxLevel(max);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching data", err);
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchQuery(e.target.value);

  const toggleExpand = (userId: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const isExpanded = (userId: string) => expandedNodes[userId] === true;

  const filteredUsers = (users: User[], currentLevel = 1): User[] => {
    if (!Array.isArray(users)) return [];

    return users.flatMap((user) => {
      const userLevel = currentLevel;
      const matchesLevel =
        activeLevel === "all" || parseInt(activeLevel) === userLevel;

      const children = filteredUsers(user.child || [], currentLevel + 1);

      if (activeLevel === "all") {
        return [{ ...user, child: children }];
      }

      if (matchesLevel) {
        return [{ ...user, child: [] }];
      }

      return children;
    });
  };

  useEffect(() => {
    fetchTreeData(getLegFromTab(activeTab));
  }, [profile, activeTab]);

  const getLevelColor = (level: number, isRoot: boolean = false) => {
    if (isRoot) return "bg-primary text-primary-foreground";
    
    // Define color gradients for different level ranges
    const colors = {
      // First 10 levels (0-9)
      first: [
        "bg-blue-500",
        "bg-cyan-500",
        "bg-blue-600",
        "bg-cyan-600",
        "bg-purple-500",
        "bg-blue-700",
        "bg-cyan-700",
        "bg-blue-800",
        "bg-blue-900",
        "bg-purple-800",
      ],
      // Next 10 levels (10-19)
      second: [
        "bg-cyan-800",
        "bg-purple-600",
        "bg-purple-700",
        "bg-cyan-900",
        "bg-purple-900",
        "bg-violet-500",
        "bg-violet-600",
        "bg-violet-700",
        "bg-violet-800",
        "bg-violet-900",
      ],
      // Last 10 levels (20-29)
      third: [
        "bg-indigo-500",
        "bg-indigo-600",
        "bg-indigo-700",
        "bg-indigo-800",
        "bg-indigo-900",
        "bg-sky-500",
        "bg-sky-600",
        "bg-sky-700",
        "bg-sky-800",
        "bg-sky-900",
      ],
    };

    // Get the appropriate color based on level
    if (level < 10) {
      return `${colors.first[level]} text-white`;
    } else if (level < 20) {
      return `${colors.second[level - 10]} text-white`;
    } else if (level < 30) {
      return `${colors.third[level - 20]} text-white`;
    }
    
    return "bg-muted text-muted-foreground";
  };

  const renderUserItem = (user: User, level: number, isRoot = false, parentKey = '', index = 0) => {
    const hasChildren = Array.isArray(user?.child) && user.child.length > 0;
    const keyPart = user.referralCode ?? user.id ?? index;
    const nodeKey = `${parentKey}-${keyPart}`;
    const expanded = isRoot ? true : isExpanded(nodeKey);
    const filteredChildren = hasChildren
      ? filteredUsers(user.child as User[], level + 1)
      : [];
    const hasFilteredChildren = filteredChildren.length > 0;

    return (
      <>
      {/* <div key={nodeKey} className="p-4 rounded-xl transition-all duration-300 border shadow-sm bg-gray-50 bg-gradient-to-b from-gray-50 to-brand-5/5">

      </div> */}
      <div
        key={nodeKey}
        className={cn(
          "relative pl-4 border-l-2 border-primary",
          isRoot && "border-l-0"
        )}
      >
        <div className="flex items-center gap-2 pb-2">
          {hasFilteredChildren && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleExpand(nodeKey)}
              className="h-6 w-6"
            >
              {expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
          <Card className="p-2 flex-1 bg-transparent border-0 gap-1 whitespace-nowrap shadow-none">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "flex items-center justify-center font-semibold text-base rounded-full size-9",
                  getLevelColor(user.level, isRoot)
                )}>
                  {isRoot ? 0 : user.level + 1}
                </div>
                <span className="font-medium">
                  {user.nickName || user.username} {user.fullName && `(${user.fullName})`}
                </span>
              </div>
              <span className={cn(
                "px-2 py-1 rounded text-xs",
                getLevelColor(user.level, isRoot)
              )}>
                {isRoot ? "You" : `Level ${user.level + 1}`}
              </span>
            </div>
            <div className="text-sm text-muted-foreground pl-12 flex flex-row gap-2">
              <div>Status: {user.planSubscription ? "Active" : "Inactive"}</div>
              <div>Amount: {formatPrice(user.planPrice ?? 0)}</div>
            </div>
          </Card>
        </div>
        {expanded && hasFilteredChildren && (
          <div className="ml-6">
            {filteredChildren.map((referral, idx) =>
              renderUserItem(referral, level + 1, false, nodeKey, idx)
            )}
          </div>
        )}
      </div>
      </>
    );
  };

  // Recursively filter the tree for search in Tree View
  const filterTree = (user: User | null, query: string): User | null => {
    if (!user) return null;
    const matches = (user.nickName || user.username).toLowerCase().includes(query.toLowerCase());
    const filteredChildren = user.child
      ? user.child
          .map((child) => filterTree(child, query))
          .filter((child) => child !== null) as User[]
      : [];
    if (matches || filteredChildren.length > 0) {
      return { ...user, child: filteredChildren };
    }
    return null;
  };

  const flattenTree = (users: User[], level = 0): User[] => {
    if (!Array.isArray(users)) return [];

    let flatList: User[] = [];

    users.forEach((user) => {
      flatList.push({ ...user, level });

      if (user.child && Array.isArray(user.child) && user.child.length > 0) {
        flatList = flatList.concat(flattenTree(user.child, level + 1));
      }
    });

    return flatList;
  };

  const renderReferralList = () => {
    if (!data) return null;
    const flatList = flattenTree([data]);

    const levelFilteredList =
      activeLevel === "all"
        ? flatList
        : flatList.filter((user) => user.level === parseInt(activeLevel));

    const finalFilteredList = searchQuery
      ? levelFilteredList.filter((user) =>
          (user.nickName || user.username).toLowerCase().includes(searchQuery.toLowerCase())
        )
      : levelFilteredList;

    // Sort the list by level in ascending order
    const sortedList = [...finalFilteredList].sort((a, b) => a.level - b.level);

    // Pagination
    const totalPages = Math.ceil(sortedList.length / listPageSize);
    const paginatedList = sortedList.slice((listPage - 1) * listPageSize, listPage * listPageSize);

    return (
      <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Investment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedList.length > 0 ? (
              paginatedList.map((node) => (
                <TableRow key={node.id}>
                  <TableCell className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{node.nickName || node.username}</span>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "px-2 py-1 rounded text-xs",
                      getLevelColor(node.level, node.isRoot)
                    )}>
                      {node.isRoot ? "You" : `Level ${node.level}`}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      "px-2 py-1 rounded text-xs",
                      node.planSubscription ? "bg-green-500 text-white" : "bg-red-500 text-white"
                    )}>
                      {node.planSubscription ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>{formatPrice(node.planPrice ?? 0)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No matching child found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </div>
        <Pagination
          currentPage={listPage}
          totalPages={totalPages}
          onPageChange={setListPage}
          className="my-5"
        />
      </>
    );
  };

  return (
    <>
      <Tabs defaultValue="treeAll" value={activeTab} onValueChange={setActiveTab} className="gap-4">
      <TabsList className="glass-effect shadow-sm w-full h-auto p-1 overflow-auto justify-normal gap-2 meta-shine meta-border" >
        <TabsTrigger value="treeAll" className="dark:data-[state=active]:meta-shine dark:data-[state=active]:text-brand-2 border-0 p-2 px-4 cursor-pointer dark:hover:meta-shine dark:hover:text-brand-2">
          <Waypoints className="size-5" />
          Tree view
        </TabsTrigger>
        <TabsTrigger value="treeA" className="dark:data-[state=active]:meta-shine dark:data-[state=active]:text-brand-2 border-0 p-2 px-4 cursor-pointer dark:hover:meta-shine dark:hover:text-brand-2">
          <Workflow className="size-5" />
          Tree Team A
        </TabsTrigger>
        <TabsTrigger value="treeB" className="dark:data-[state=active]:meta-shine dark:data-[state=active]:text-brand-2 border-0 p-2 px-4 cursor-pointer dark:hover:meta-shine dark:hover:text-brand-2">
          <Workflow className="size-5" />
          Tree Team B
        </TabsTrigger>
      </TabsList>
      <Card className="gap-0">
        <CardHeader className="gap-0">
          <div className="flex flex-wrap gap-5 justify-between">
          <div>
          <CardTitle className="text-white text-lg lg:text-2xl font-bold">Team Tree Structure</CardTitle>
          <CardDescription className="text-slate-400 font-medium">Click arrows to expand/collapse team members</CardDescription>
          </div>
          <div className="mt-2 mb-4 text-right flex flex-nowrap items-center gap-2">
          <Input
              type="search"
              placeholder="Search users..."
              value={searchQuery}
              onChange={handleSearch}
              className="min-h-10 h-10 text-sm flex-1"
            />
            <Select value={activeLevel} onValueChange={setActiveLevel}>
              <SelectTrigger className="min-h-10 text-sm flex-1">
                <SelectValue placeholder="Select Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {Array.from({ length: maxLevel + 1 }, (_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    Level {i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          </div>
        </CardHeader>
        <CardContent>
          <TabsContent value="treeAll" className="mt-4">
          {isLoading && !data ? (
            <>
            {Array.from({ length: 4 }).map((_,i) => (
              <div key={i} className="p-4 rounded-xl transition-all duration-300 border ">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-full" />
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-[250px] max-w-full" />
                    <Skeleton className="h-4 w-[200px] max-w-full" />
                  </div>
                  </div>
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-[100px] max-w-full" />
                    <Skeleton className="h-4 w-[50px] max-w-full ml-auto" />
                  </div>
                </div>
              </div>
            ))}
          </>
          ) : (
            <>
            {data && filterTree(data, searchQuery) && renderUserItem(filterTree(data, searchQuery) as User, 0, true, 'root', 0)}
            </>
          )}
          </TabsContent>
          <TabsContent value="treeA" className="mt-4">
          {isLoading && !data ? (
            <>
            {Array.from({ length: 4 }).map((_,i) => (
              <div key={i} className="p-4 rounded-xl transition-all duration-300 border ">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-full" />
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-[250px] max-w-full" />
                    <Skeleton className="h-4 w-[200px] max-w-full" />
                  </div>
                  </div>
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-[100px] max-w-full" />
                    <Skeleton className="h-4 w-[50px] max-w-full ml-auto" />
                  </div>
                </div>
              </div>
            ))}
          </>
          ) : (
            <>
            {data && filterTree(data, searchQuery) && renderUserItem(filterTree(data, searchQuery) as User, 0, true, 'root', 0)}
            </>
          )}
          </TabsContent>
          <TabsContent value="treeB" className="mt-4">
          {isLoading && !data ? (
            <>
            {Array.from({ length: 4 }).map((_,i) => (
              <div key={i} className="p-4 rounded-xl transition-all duration-300 border ">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-full" />
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-[250px] max-w-full" />
                    <Skeleton className="h-4 w-[200px] max-w-full" />
                  </div>
                  </div>
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-[100px] max-w-full" />
                    <Skeleton className="h-4 w-[50px] max-w-full ml-auto" />
                  </div>
                </div>
              </div>
            ))}
          </>
          ) : (
            <>
            {data && filterTree(data, searchQuery) && renderUserItem(filterTree(data, searchQuery) as User, 0, true, 'root', 0)}
            </>
          )}
          </TabsContent>
        </CardContent>
      </Card>
      </Tabs>
    </>
  );
}